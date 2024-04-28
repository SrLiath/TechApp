import { getData } from './Krypto'
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';

export const sendTicket = async (url, body) => {
    console.log(`'${body}'`);
    console.log(`'${url}'`)
    NetInfo.fetch().then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
    });
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': await getData('auth'),
                'App-Token': await getData('app_token'),
                'Session-Token': await getData('session_token'),
                'Connection': 'keep-alive',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error('Erro na requisição:', response.status);
            const errorBody = await response.json();
            console.error('Corpo do erro:', errorBody);
            return null;
        }

        const responseData = await response.json();
        console.log('Response Code:', response.status);

        return responseData;
    } catch (error) {
        console.error('Erro durante a requisição:', error.message);
        return null;
    }
};

export const getOwnId = async () => {
    try {
        const url = 'https://suporte.techsize.com.br/apirest.php/getFullSession/';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': await getData('auth'),
                'App-Token': await getData('app_token'),
                'Session-Token': await getData('session_token'),
                'Connection': 'keep-alive',
            },
        });

        const responseJson = await response.json();

        const sessionJSON = responseJson.session;
        const idString = sessionJSON?.glpiID || '';
        console.log(idString)
        return idString;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const confirm = async (id) => {
    try {
        const url = `https://suporte.techsize.com.br/apirest.php/Ticket/${id}/`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': await getData('auth'),
                'App-Token': await getData('app_token'),
                'Session-Token': await getData('session_token'),
            },
            body: JSON.stringify({
                'input': { 'status': 5 }
            }),
        });
        if (response.status === 200) {
            return true
        } else {
            Toast.showWithGravity('Erro, reinicie o app ou contate um admin', Toast.LONG, Toast.CENTER);

        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

