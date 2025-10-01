import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { styles } from '../../styles/loginStyles';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from './CustomAlert';
import { PasswordInput } from './PasswordInput';

interface LoginFormProps {
  onLoginSuccess: () => void; 
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertTitle('Campos incompletos');
      setAlertMessage('Por favor completa todos los campos');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      // 🔹 Llamada al backend usando tu AuthContext
      await login({ username: email, password });

      setAlertTitle('¡Bienvenido!');
      setAlertMessage('Login exitoso');
      setAlertVisible(true);

      // 🔹 Redirigir a Schedules después de un pequeño delay
      setTimeout(() => {
        setAlertVisible(false);
        onLoginSuccess();
      }, 1200);
    } catch {
      setAlertTitle('Error de autenticación');
      setAlertMessage('Credenciales inválidas');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Usuario */}
      <View style={styles.inputWrapper}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Contraseña */}
      <PasswordInput
        value={password}
        onChange={setPassword}
        isVisible={isPasswordVisible}
        onToggle={togglePasswordVisibility}
      />

      {/* Botón login */}
      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </Text>
      </TouchableOpacity>

      {/* Modal de alerta */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}
