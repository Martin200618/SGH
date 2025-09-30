import React from 'react';
import { render } from '@testing-library/react-native';
import LoginForm from '../LoginForm';

// Mock the AuthContext
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

describe('LoginForm component', () => {
  it('renders the form elements correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginForm onLoginSuccess={() => {}} />
    );

    expect(getByPlaceholderText('Usuario')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByText('Ingresar')).toBeTruthy();
  });
});