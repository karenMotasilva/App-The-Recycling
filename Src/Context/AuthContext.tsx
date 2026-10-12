import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken } from '../Services/api';

type PublicUser = {
  name: string;
  email: string;
};

type AuthContextData = {
  user: PublicUser | null;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string,
    cpf: string,
    apartamento: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

const SESSION_KEY = '@therecycling:session';

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o aplicativo, começa sem usuário conectado.
  useEffect(() => {
    async function loadSession() {
      try {
        await AsyncStorage.removeItem(SESSION_KEY);
        setUser(null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  // Cadastrar uma nova conta (a API valida e-mail duplicado).
  async function register(
    name: string,
    email: string,
    password: string,
    cpf: string,
    apartamento: string
  ) {
    const data = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, cpf, apartamento }),
    });

    setToken(data.token);
    setUser(data.user);
  }

  // Entrar em uma conta existente.
  async function login(
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (error: any) {
      if (error.status === 401) return false;
      throw error;
    }
  }

  // Sair da conta.
  async function logout() {
    await AsyncStorage.removeItem(SESSION_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
