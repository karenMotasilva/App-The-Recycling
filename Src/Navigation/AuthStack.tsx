import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../Screens/LoginScreen';
import CadastroScreen from '../Screens/CadastroScreen';
import { MainTabNavigator } from './TabNavigator';
import { useAuth } from '../Context/AuthContext';

const Stack = createNativeStackNavigator();

export const AuthStack: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen
          name="MainApp"
          component={MainTabNavigator}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Cadastro"
            component={CadastroScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};