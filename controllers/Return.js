// it's me
import { getData, saveData } from './Krypto';
const CheckSession = async () => {
    try {
        const token = await getData('session_token');
        if (token != null) {
            try {
                const url = 'https://suporte.techsize.com.br/apirest.php/getFullSession/';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'App-Token': await getData('app_token'),
                        'Session-Token': await getData('session_token')
                    },
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    const responseBody = await response.json(); // Obtenha o corpo da resposta como JSON
                    const session = responseBody.session;
                    if (session != null) {
                        return true
                    }
                } else {
                    const responseBody = await response.text(); // Obtenha o corpo da resposta
                    console.error('Erro ao autenticar:', response.status, response.statusText, responseBody);
                }
            } catch (error) {
                console.error('Erro durante a autenticação:', error.message);
            }
        }
        const url = 'https://suporte.techsize.com.br/apirest.php/getMyProfiles/';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': await getData('auth'),
                'App-Token': await getData('app_token')
            },
            body: JSON.stringify({}),
        });

        if (response.ok) {
            const responseBody = await response.json(); // Obtenha o corpo da resposta como JSON
            const sessionToken = responseBody.session_token;
            if (sessionToken == null) {
                return false
            }
            await saveData('session_token', sessionToken);
            return true
        } else {
            const responseBody = await response.text(); // Obtenha o corpo da resposta
            console.error('Erro ao autenticar:', response.status, response.statusText, responseBody);
            return false
        }
    } catch (error) {
        console.error('Erro durante a autenticação:', error.message);
        return false
    }
};

export { CheckSession };
