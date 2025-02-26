import React from 'react';

import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";
import * as SecureStore from "expo-secure-store";

type NfeProps = {
  cpf: string;
  nome_cliente: string;
  nfe: string;
  nota_fiscal: number;
  numero_dav: number | null;
  numero_pre_nota: number | null;
  romaneio: number | null;
};

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onLogin?: (mode: string, username: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  storeData?: string | null;
  lojaInfo?: string | null;
  onNfeData?: (value: string) => Promise<any>;
  nfeData?: NfeProps;
}

export const API_URL = "https://api.apotiguar.com.br:64462";

const TOKEN_KEY = "my-jwt";
const URL_VALIDATE_DATA_SCANNER = "http://192.168.102.14:3000/consulta?";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  const [storeData, setStoreData] = useState<string>("");
  const [lojaInfo, setLojaInfo] = useState<string>("");

  const [nfeData, setNfeData] = useState();

  useEffect(() => {
    const loadToken = async () => {
      
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("stored:", token);
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const loadData = async (s: string) => {
    if (!s) {
      console.error("O código de barras escaneado é vazio ou indefinido.");
      return;
    } else {
      const response = await fetch(
        URL_VALIDATE_DATA_SCANNER + `chaveAcesso=${s}&unidadeIE=102`,
      );
      const data = await response.json();
      setNfeData(data[0]);
    }
  };

  const validatePerfil = (validateAuth: any, result: any) => {
    if (
      (result.data.data && validateAuth.admin === 1) ||
      validateAuth.exp === 1 ||
      validateAuth.expl === 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const login = async (mode: string, username: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}`, {
        mode,
        username,
        password,
      });

      if (validatePerfil(result.data.data.permissions, result)) {
        setAuthState({
          token: result.data.data.token,
          authenticated: true,
        });

        setStoreData(result.data.data.store_code);
        setLojaInfo(result.data.data.store_name);

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${result.data.data.token}`;

        await SecureStore.setItemAsync(TOKEN_KEY, result.data.data.token);

        return result;
      } else {
        return {
          error: true,
          msg: "Erro ao autenticar. Token não recebido na resposta.",
        };
      }
    } catch (e: any) {
      return {
        error: true,
        msg:
          e.response &&
          e.response.data &&
          e.response.data.data &&
          e.response.data.data.flag
            ? e.response.data.data.flag
            : "Erro desconhecido ao autenticar.",
      };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
    storeData,
    onNfeData: loadData,
    nfeData,
    lojaInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
