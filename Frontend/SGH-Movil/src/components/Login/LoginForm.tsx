import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { styles } from '../../styles/loginStyles';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login({ username: email, password });
      Alert.alert('¡Bienvenido!', 'Login exitoso');
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
          editable={!loading}
        />
      </View>

      {/* Contraseña */}
      <View style={styles.inputWrapper}>
        <Image source={require('../../assets/images/lock.png')} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      {/* Botón */}
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
    </View>
  );
}
