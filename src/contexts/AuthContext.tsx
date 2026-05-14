import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const startTime = Date.now();
      try {
        const storedToken = await AsyncStorage.getItem('@Proestoque:token');
        const storedUser = await AsyncStorage.getItem('@Proestoque:user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load session', error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1500 - elapsed);
        setTimeout(() => {
          setIsLoading(false);
        }, remaining);
      }
    };

    loadSession();
  }, []);

  const login = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const mockedToken = 'mock-jwt-token-123';
      const mockedUser = { nome: 'João Silva', email: 'joao@email.com' };
      
      await AsyncStorage.setItem('@Proestoque:token', mockedToken);
      await AsyncStorage.setItem('@Proestoque:user', JSON.stringify(mockedUser));
      
      setToken(mockedToken);
      setUser(mockedUser);
    } catch (error) {
      console.error('Failed to login', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('@Proestoque:token');
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
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!token, login, logout }}>
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
