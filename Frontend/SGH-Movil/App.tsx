import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

function Main() {
  return (
    <SafeAreaProvider>
      {/* Área segura para el StatusBar */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#007BFF"
          translucent={false}
        />
      </SafeAreaView>

      {/* Contenido de la app envuelto en AuthProvider */}
      <View style={styles.container}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#007BFF', // Color de fondo del StatusBar
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

registerRootComponent(Main);
export default Main;
