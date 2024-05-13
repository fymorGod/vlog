import React, { useState } from "react";
import { Alert, Button, Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

export function Login() {
    const mode = 'login'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { onLogin } = useAuth()

    const login = async () => {
        if (!username || !password) {
            Alert.alert('Campos inválidos, Por favor preencha os campos!')
            return;
        }

        const result = await onLogin!(mode, username, password);
        if (result && result.error) {
            alert(result.msg)
        }
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <LinearGradient colors={['#cd0914', '#871015']} style={styles.linearGradient}>
                    <View style={styles.container}>
                        <View style={styles.containerLogo}>
                            <Image style={styles.tineLogo} source={require('../../../assets/logo.png')} />
                        </View>
                        <View style={styles.containerForm}>
                            <Text style={styles.text}>Login</Text>
                            <Text style={styles.textSpan}>Bem vindo ao sistema de entregas - Vlog</Text>
                            <TextInput
                                style={styles.inputs}
                                placeholder="Username"
                                autoCapitalize='none'
                                onChangeText={(text: string) => setUsername(text)}
                                value={username}
                            />
                            <TextInput
                                style={styles.inputs}
                                placeholder="Senha"
                                secureTextEntry
                                onChangeText={(text: string) => setPassword(text)}
                                value={password}
                            />
                            <Button
                                title="Entrar"
                                onPress={login}
                            />
                        </View>
                        <View style={styles.containerVersion}>
                            <Text style={styles.textSpanVersion}>v.1.0.2</Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableWithoutFeedback>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLogo: {
        width: '100%',
        height: '35%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerForm: {
        width: '100%',
        height: '65%',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 80,
        backgroundColor: '#f2f2f2',
        padding: 20,
    },
    text: {
        fontSize: 30,
        marginTop: 40,
        marginBottom: 20,
        marginLeft: 40,
        color: '#170E49',
    },
    textSpan: {
        fontSize: 12,
        marginLeft: 40,
        marginTop: -10,
        marginBottom: 20,
        fontWeight: '300',
        fontStyle: 'italic',
        color: '#170E49',
    },
    containerVersion: {
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    textSpanVersion: {
        fontSize: 12,
        marginTop: -10,
        marginBottom: 20,
        fontWeight: '300',
        fontStyle: 'italic',
        color: '#170E49',
    },
    linearGradient: {
        flex: 1,
    },
    tineLogo: {
        resizeMode: 'contain',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    inputs: {
        width: '80%',
        height: 56,
        backgroundColor: '#fff',
        color: '#7A7A80',
        paddingLeft: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
    },
});