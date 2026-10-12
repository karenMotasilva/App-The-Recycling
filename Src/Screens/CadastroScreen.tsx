import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';

export default function CadastroScreen() {
  const navigation = useNavigation<any>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [sending, setSending] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !cpf.trim() || !apartamento.trim() || !password || !confirmPassword) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todos os campos para continuar.',
      );
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert(
        'E-mail inválido',
        'Informe um endereço de e-mail válido.',
      );
      return;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      Alert.alert(
        'CPF inválido',
        'Informe os 11 dígitos do CPF.',
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Senha muito curta',
        'A senha precisa ter pelo menos 6 caracteres.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Senhas diferentes',
        'Confira se as duas senhas são iguais.',
      );
      return;
    }

    setSending(true);

    try {
      await register(name, email, password, cpf, apartamento);

      Alert.alert(
        'Conta criada',
        'Seu cadastro foi concluído!',
      );

      // O AuthStack abrirá o aplicativo principal
      // automaticamente após a autenticação.
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Tente novamente.';

      Alert.alert('Não foi possível cadastrar', message);
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Voltar para o login</Text>
        </Pressable>

        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Criar conta</Text>

        <Text style={styles.subtitle}>
          The Recycling Flow - Gamificação da Reciclagem
        </Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#82969A"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

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

        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="000.000.000-00"
          placeholderTextColor="#82969A"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={14}
        />

        <Text style={styles.label}>Apartamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Bloco A, apto 302"
          placeholderTextColor="#82969A"
          value={apartamento}
          onChangeText={setApartamento}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Pelo menos 6 caracteres"
          placeholderTextColor="#82969A"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a senha novamente"
          placeholderTextColor="#82969A"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable
          style={styles.button}
          onPress={handleRegister}
          disabled={sending}
        >
          <Text style={styles.buttonText}>
            {sending ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF5F7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 14,
  },
  backButton: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#078398',
    fontWeight: '700',
    fontSize: 14,
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
    marginBottom: 10,
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
});