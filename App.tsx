import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

import { LoadingScreen } from './Src/Screens/LoadingScreen';
import { AuthStack } from './Src/Navigation/AuthStack';
import { Theme } from './Src/Theme/Theme';

// Impede que o ecrã inicial desapareça antes do JavaScript carregar por completo
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initApp() {
      try {
        // Simula o tempo de carregamento (2.5s)
        await new Promise((resolve) => setTimeout(resolve, 2500));
      } finally {
        setIsLoading(false);
        // Oculta a splash screen nativa do Expo
        await SplashScreen.hideAsync().catch(() => {});
      }
    }

    initApp();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}