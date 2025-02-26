import React from 'react';
import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, View } from "react-native";
import { InitScanner } from "./src/screens/InitScanner";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { Login } from './src/screens/Login';
import { Home } from './src/screens/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  );
}

export const Layout = () => {
  const { authState, onLogout } = useAuth();

  console.log(authState)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <>
           <Stack.Screen
              name="InitS"
              component={InitScanner}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <Button onPress={onLogout} title="Sair" color="#170E49" />
                  </View>
                ),
              }}
            ></Stack.Screen>
{/* 
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <Button onPress={onLogout} title="Sair" color="#170E49" />
                  </View>
                ),
              }}
            ></Stack.Screen> */}

            {/* <Stack.Screen
              name="Dash"
              component={Dash}
              options={{
                title: `${lojaInfo}`,
                headerTintColor: "#f/4511e",
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <Button onPress={onLogout} title="Sair" color="#170E49" />
                  </View>
                ),
              }}
            />
             */}
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          ></Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 10,
  },
});
