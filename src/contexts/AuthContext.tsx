import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@Proestoque:token');
        const storedRefreshToken = await AsyncStorage.getItem('@Proestoque:refreshToken');

        if (storedToken && storedRefreshToken) {
          try {
            const response = await api.get('/auth/me');
            setUser(response.data);
            setToken(storedToken);
          } catch (error) {
            await AsyncStorage.removeItem('@Proestoque:token');
            await AsyncStorage.removeItem('@Proestoque:refreshToken');
            await AsyncStorage.removeItem('@Proestoque:user');
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Failed to load session', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { usuario, token: newToken, refreshToken } = response.data;

      await AsyncStorage.setItem('@Proestoque:token', newToken);
      await AsyncStorage.setItem('@Proestoque:refreshToken', refreshToken);
      await AsyncStorage.setItem('@Proestoque:user', JSON.stringify(usuario));

      setToken(newToken);
      setUser(usuario);
    } catch (error) {
      console.error('Failed to login', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registrar = async (nome: string, email: string, senha: string) => {
    setIsLoading(true);
    try {
      await api.post('/auth/registro', { nome, email, senha });
      // Após registrar, fazemos o login automaticamente
      await login(email, senha);
    } catch (error) {
      console.error('Failed to register', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('@Proestoque:token');
      await AsyncStorage.removeItem('@Proestoque:refreshToken');
      await AsyncStorage.removeItem('@Proestoque:user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Failed to logout', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!token, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
