import React from 'react';
import { ImageBackground, View, Image, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
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
        {/* Overlay semi-transparente */}
        <View style={styles.darkOverlay} />
        
        <ScrollView contentContainerStyle={styles.container}>
          <LoginHeader />

          {/* Contenido principal centrado */}
          <View style={styles.mainContent}>
            {/* Logo circular con fondo blanco */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Título de inicio de sesión */}
            <View style={styles.titleContainer}>
              <Text style={styles.loginTitle}>Inicio de sesión</Text>
            </View>

            {/* Formulario */}
            <LoginForm />
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}