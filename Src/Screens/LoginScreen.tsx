import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useAuth } from '../Context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const LoginScreen: React.FC = () => {
  const { login, loading } = useAuth();
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert(
        'Campos obrigatórios',
        'Informe seu e-mail e sua senha.',
      );
      return;
    }

    setSending(true);

    try {
      const sucesso = await login(email, password);

      if (!sucesso) {
        Alert.alert(
          'Não foi possível entrar',
          'E-mail ou senha incorretos.',
        );
      }
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível entrar. Tente novamente.',
      );
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#078398" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Entrar na conta</Text>

          <Text style={styles.subtitle}>
            The Recycling Flow - Gamificação da Reciclagem
          </Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#82969A"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#82969A"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            style={styles.button}
            onPress={handleLogin}
            disabled={sending}
          >
            <Text style={styles.buttonText}>
              {sending ? 'Entrando...' : 'Entrar'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.createButton}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.createText}>
              Ainda não tem conta? Criar conta
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF5F7',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF5F7',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 14,
  },
  logo: {
    width: 105,
    height: 105,
    alignSelf: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#078398',
    textAlign: 'center',
  },
  subtitle: {
    color: '#30444A',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
    fontSize: 13,
  },
  label: {
    fontWeight: '500',
    color: '#30444A',
    marginTop: 8,
    marginBottom: 5,
  },
  input: {
    height: 45,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CFDFE2',
    borderRadius: 9,
    paddingHorizontal: 13,
    fontSize: 15,
    color: '#20383E',
  },
  button: {
    height: 52,
    backgroundColor: '#078398',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  createButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  createText: {
    color: '#078398',
    fontWeight: '700',
    fontSize: 14,
  },
});