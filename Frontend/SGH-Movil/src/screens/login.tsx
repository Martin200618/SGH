import React from 'react';
import { ImageBackground, View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { styles } from '../styles/loginStyles';
import LoginHeader from '../components/Login/LoginHeader';
import LoginForm from '../components/Login/LoginForm';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.overlay}>
          <LoginHeader />

          {/* Logo grande y centrado */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Formulario */}
          <LoginForm />
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
