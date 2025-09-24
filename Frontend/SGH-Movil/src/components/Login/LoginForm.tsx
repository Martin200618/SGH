import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { styles } from '../../styles/loginStyles';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from './CustomAlert';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PasswordInput } from './PasswordInput';
import { RootStackParamList } from '../../navigation/types';

export default function LoginForm() {
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertTitle('Campos incompletos');
      setAlertMessage('Por favor completa todos los campos');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      await login({ username: email, password });

      setAlertTitle('¡Bienvenido!');
      setAlertMessage('Login exitoso');
      setAlertVisible(true);

      setTimeout(() => {
        setAlertVisible(false);
        navigation.replace('Schedules');
      }, 1500);

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
        <Image source={require('../../assets/images/user.png')} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Contraseña optimizada */}
      <PasswordInput value={password} onChange={setPassword} />

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

      {/* Modal */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}
  