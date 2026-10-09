import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../Theme/GlobalStyles';

export const LoginScreen: React.FC = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.title}>Login</Text>
    </SafeAreaView>
  );
};