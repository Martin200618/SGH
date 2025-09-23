import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginService } from '../api/services/authService';
import { LoginRequest } from '../api/types/auth';

interface AuthContextType {
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  // 🔹 Cargar token desde AsyncStorage al iniciar la app
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await loginService(credentials);
    const receivedToken = response.token; // ✅ usamos un nombre distinto
    setToken(receivedToken);
    await AsyncStorage.setItem('token', receivedToken);
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
