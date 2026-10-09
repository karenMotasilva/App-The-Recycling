import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../Theme/GlobalStyles';

export const RankingScreen: React.FC = () => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <Text style={globalStyles.title}>Ranking</Text>
    </SafeAreaView>
  );
};