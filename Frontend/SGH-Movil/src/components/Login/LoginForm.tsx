import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { styles } from '../../styles/loginStyles';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('¡Bienvenido!', 'Login exitoso');
    }, 1500);
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
        />
      </View>

      {/* Botón Ingresar */}
      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
