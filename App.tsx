import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

import { LoadingScreen } from './Src/Screens/LoadingScreen';
import { AuthStack } from './Src/Navigation/AuthStack';
import { Theme } from './Src/Theme/Theme';
import { AuthProvider } from './Src/Context/AuthContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initApp() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2500));
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync().catch(() => {});
      }
    }

    initApp();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
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
      </AuthProvider>
    </SafeAreaProvider>
  );
}
