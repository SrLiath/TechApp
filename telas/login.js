// login.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getData, saveData } from '../controllers/Krypto';
import { CheckSession } from '../controllers/Return';
import Toast from 'react-native-simple-toast';
export default function LoginScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    if (!global.btoa) {
        global.btoa = require('base-64').encode;
    }

    if (!global.atob) {
        global.atob = require('base-64').decode;
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (await getData('app_token')) {
                    Toast.showWithGravity('App token:   ' + await getData('app_token'), Toast.LONG, Toast.CENTER);
                } else {
                    Toast.showWithGravity('Cadastre um app token', Toast.LONG, Toast.CENTER);
                }
                if (await getData('auth')) {
                    console.log('auth');
                    if (await CheckSession()) {
                        console.log('session');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Inicio' }],
                        });
                    }
                }
            } catch (error) {
                console.error('Erro durante a execução do useEffect:', error.message);
            }
        };

        fetchData();
    }, [navigation]);

    const handleLogin = async () => {
        try {
            const url = 'https://suporte.techsize.com.br/apirest.php/initSession/';
            const authHeader = 'Basic ' + btoa(`${username}:${password}`);
            await saveData('auth', authHeader);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                    'App-Token': await getData('app_token')
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {

                const responseBody = await response.json(); // Obtenha o corpo da resposta como JSON
                const sessionToken = responseBody.session_token;
                if (sessionToken != null) {
                    await saveData('session_token', sessionToken);
                    navigation.navigate('Inicio');
                }
            } else {
                const responseBody = await response.text(); // Obtenha o corpo da resposta
                console.error('Erro ao autenticar:', response.status, response.statusText, responseBody);
            }
        } catch (error) {
            console.error('Erro durante a autenticação:', error.message);
        }
    };


    const handleGearIconClick = () => {
        // Config
        navigation.navigate('Config');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.gearIcon} onPress={handleGearIconClick}>
                <Image source={require('../assets/img/gear.png')} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
            <Image source={require('../assets/img/tech.png')} style={styles.logo} />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Usuario"
                    placeholderTextColor="#f8f8ff"
                    onChangeText={(text) => setUsername(text)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    secureTextEntry
                    style={styles.inputText}
                    placeholder="Senha"
                    placeholderTextColor="#f8f8ff"
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1b1e23',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
    },
    logo: {
        width: 150,
        height: 150,
        marginTop: 40,
    },
    inputView: {
        width: '80%',
        backgroundColor: '#465881',
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
    },
    inputText: {
        height: 50,
        color: 'white',
    },
    loginBtn: {
        width: '80%',
        backgroundColor: '#fb5b5a',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    loginText: {
        color: 'white',
    },
    gearIcon: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
});



