import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../Header';

describe('Header component', () => {
  it('renders the title and button label correctly', () => {
    const { getByText } = render(
      <Header title="Inicio" buttonLabel="Salir" onPress={() => {}} />
    );

    // Verifica que el título y el botón se rendericen
    expect(getByText('Inicio')).toBeTruthy();
    expect(getByText('Salir')).toBeTruthy();
  });

  it('calls onPress when the button is pressed', () => {
    const mockOnPress = jest.fn();

    const { getByText } = render(
      <Header title="Dashboard" buttonLabel="Cerrar sesión" onPress={mockOnPress} />
    );

    // Simula el click en el botón
    fireEvent.press(getByText('Cerrar sesión'));

    // Verifica que se haya llamado una vez
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
