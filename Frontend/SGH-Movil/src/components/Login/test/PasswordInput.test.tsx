import React from 'react';
import { render } from '@testing-library/react-native';
import { PasswordInput } from '../PasswordInput';

describe('PasswordInput component', () => {
  it('renders the input correctly', () => {
    const { getByPlaceholderText } = render(
      <PasswordInput value="" onChange={() => {}} />
    );

    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
  });
});