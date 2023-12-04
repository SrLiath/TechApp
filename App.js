// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './telas/inicio';
import LoginScreen from './telas/login';
import ConfigScreen from './telas/config';
import { enableScreens } from 'react-native-screens';
import { getData } from './controllers/Krypto'

enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {

  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  useEffect(async () => {
    setUsuarioAutenticado(false);
    if (await getData('auth')) {
      console.log('auth')
      if (CheckSession()) {
        console.log('session')
        setUsuarioAutenticado(true);
        navigation.navigate('Inicio');
      }
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {usuarioAutenticado ? (
          <Stack.Screen name="Home"
            component={HomeScreen}
            options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Login"
            component={LoginScreen}
            options={{ headerShown: false }} />
        )}

        <Stack.Screen name="Inicio"
          component={HomeScreen}
          options={{ headerShown: false }} />

        <Stack.Screen name="Config"
          component={ConfigScreen}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
