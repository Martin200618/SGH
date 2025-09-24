import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginService } from '../api/services/authService';
import { LoginRequest } from '../api/types/auth';

interface AuthContextType {
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar token desde AsyncStorage al iniciar la app
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Error loading token from storage', err);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await loginService(credentials);
    const receivedToken = response.token;

    if (!receivedToken) {
      throw new Error('No token received from backend');
    }

    setToken(receivedToken);
    await AsyncStorage.setItem('token', receivedToken);
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
