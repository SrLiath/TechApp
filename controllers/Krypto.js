// auau
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';

const key = 'T3cHSSs1Z$43';

export const saveData = async (identifier, data) => {
    try {
        const jsonData = JSON.stringify(data);
        const encryptedData = CryptoJS.AES.encrypt(jsonData, key).toString();
        await AsyncStorage.setItem(identifier, encryptedData);
    } catch (error) {
        console.error('Erro ao salvar dados de forma segura:', error);
    }
};

export const getData = async (identifier) => {
    try {
        const encryptedData = await AsyncStorage.getItem(identifier);

        if (encryptedData) {
            const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
            const data = JSON.parse(decryptedData);

            return data;
        }

        return null;
    } catch (error) {
        console.error('Erro ao recuperar dados de forma segura:', error);
        return null;
    }
};
