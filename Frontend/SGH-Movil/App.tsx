import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import { StatusBar, View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function Main() {
  return (
    <SafeAreaProvider>
      {/* Contenedor que respeta el área segura y pinta el fondo del StatusBar */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#007BFF"
          translucent={false}
        />
      </SafeAreaView>

      {/* Contenido de la app */}
      <View style={styles.container}>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
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
