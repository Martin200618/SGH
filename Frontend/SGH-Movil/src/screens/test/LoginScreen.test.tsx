import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: jest.fn(),
  }),
  NativeStackNavigationProp: () => ({}),
}));

describe('LoginScreen component', () => {
  it('renders the login title correctly', () => {
    const { getByText } = render(<LoginScreen />);

    expect(getByText('Inicio de sesión')).toBeTruthy();
  });
});