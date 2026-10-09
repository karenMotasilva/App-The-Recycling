import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../Theme/Theme';

export const LoadingScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.spacer} />

      <View style={styles.centerContent}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Recicle. Ganhe. Transforme.</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.xl,
  },
  spacer: {
    height: 40,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: Theme.spacing.sm,
  },
  tagline: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.weights.regular,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    marginBottom: Theme.spacing.md,
  },
  loadingText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
});