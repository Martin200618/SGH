import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  test('renders header with greeting and message', () => {
    render(<Header />);

    expect(screen.getByText('Hola Admin 👋')).toBeInTheDocument();
    expect(screen.getByText('Hagamos algo nuevo hoy!')).toBeInTheDocument();
  });
});