import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { getData, saveData } from '../controllers/Krypto';
import Toast from 'react-native-toast-message';

export default function ConfigScreen({ navigation }) {
    const [appToken, setAppToken] = useState("");

    useEffect(() => {
        const loadToken = async () => {
            const token = await getData('app_token');
            setAppToken(token || "");
        };

        loadToken();
    }, []);

    const handleSaveToken = async () => {
        console.log(await getData('app_token'))
        await saveData('app_token', appToken)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Configurações</Text>

            <View style={styles.inputView}>
                <Text style={styles.label}>APP TOKEN:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o app token"
                    value={appToken}
                    onChangeText={(text) => setAppToken(text)}
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveToken}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <Button title="Voltar" onPress={() => navigation.goBack()} />

            <View style={styles.footer}>
                <Text style={styles.footerText}>TechSize - {new Date().getFullYear()}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1b1e23',
        paddingTop: 50
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: 'white'
    },
    inputView: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'white'

    },
    input: {
        top: 20,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        color: 'white'
    },
    saveButton: {
        backgroundColor: "#1b1e34",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1b1e23",
        padding: 10,
        alignItems: "center",
    },
    footerText: {
        color: "white",
    },
});
