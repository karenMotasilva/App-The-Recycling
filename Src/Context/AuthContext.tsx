import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  name: string;
  email: string;
  password: string;
};

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
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

const USERS_KEY = '@therecycling:users';
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

  // Cadastrar uma nova conta.
  async function register(
    name: string,
    email: string,
    password: string
  ) {
    const normalizedEmail = email.trim().toLowerCase();

    const savedUsers = await AsyncStorage.getItem(USERS_KEY);

    const users: User[] = savedUsers
      ? JSON.parse(savedUsers)
      : [];

    const emailExists = users.some(
      (item) => item.email === normalizedEmail
    );

    if (emailExists) {
      throw new Error(
        'Já existe uma conta cadastrada com esse e-mail.'
      );
    }

    const newUser: User = {
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    const publicUser: PublicUser = {
      name: newUser.name,
      email: newUser.email,
    };

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify([...users, newUser])
    );

    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(publicUser)
    );

    setUser(publicUser);
  }

  // Entrar em uma conta existente.
  async function login(
    email: string,
    password: string
  ): Promise<boolean> {
    const savedUsers = await AsyncStorage.getItem(USERS_KEY);

    const users: User[] = savedUsers
      ? JSON.parse(savedUsers)
      : [];

    const normalizedEmail = email.trim().toLowerCase();

    const foundUser = users.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password
    );

    if (!foundUser) {
      return false;
    }

    const publicUser: PublicUser = {
      name: foundUser.name,
      email: foundUser.email,
    };

    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(publicUser)
    );

    setUser(publicUser);

    return true;
  }

  // Sair da conta.
  async function logout() {
    await AsyncStorage.removeItem(SESSION_KEY);
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