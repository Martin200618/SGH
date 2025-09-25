import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import SchedulesScreen from '../screens/SchedulesScreen';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Schedules: undefined; // 👈 esta es la ruta válida
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Schedules" component={SchedulesScreen} />
    </Stack.Navigator>
  );
}
