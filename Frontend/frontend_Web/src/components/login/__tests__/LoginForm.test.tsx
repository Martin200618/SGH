import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';

describe('LoginForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with all elements', () => {
    render(<LoginForm />);
    expect(screen.getByText('Inicio de sesión')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<LoginForm />);
    const form = document.querySelector('form')!;

    fireEvent.submit(form);

    expect(screen.getByText('El nombre de usuario es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
  });

  test('shows validation error for invalid username', async () => {
    render(<LoginForm />);
    const userInput = screen.getByPlaceholderText('Usuario');
    const form = document.querySelector('form')!;

    await userEvent.type(userInput, 'INVALID123');
    fireEvent.submit(form);

    expect(screen.getByText('El nombre de usuario solo puede contener letras minúsculas')).toBeInTheDocument();
  });

  test('shows validation error for weak password', async () => {
    render(<LoginForm />);
    const userInput = screen.getByPlaceholderText('Usuario');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });

    await userEvent.type(userInput, 'validuser');
    await userEvent.type(passwordInput, '123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    });
  });

  test('toggles password visibility', async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const toggleButton = screen.getByRole('button', { name: '' }); // The eye icon button

    expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('submits form with valid data', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    const userInput = screen.getByPlaceholderText('Usuario');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });

    await userEvent.type(userInput, 'validuser');
    await userEvent.type(passwordInput, 'ValidPass123');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        user: 'validuser',
        password: 'ValidPass123',
        acceptTerms: true
      });
    });
  });

  test('shows loading state during submission', async () => {
    // Mock the onSubmit to be async and take some time
    const mockAsyncSubmit = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<LoginForm onSubmit={mockAsyncSubmit} />);
    const userInput = screen.getByPlaceholderText('Usuario');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });

    await userEvent.type(userInput, 'validuser');
    await userEvent.type(passwordInput, 'ValidPass123');

    await userEvent.click(submitButton);

    // Check that loading state appears
    expect(screen.getByText('Ingresando...')).toBeInTheDocument();

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockAsyncSubmit).toHaveBeenCalled();
    });
  });

  test('displays auth error', () => {
    render(<LoginForm authError="Credenciales inválidas" />);
    expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
  });

  test('displays success message', () => {
    render(<LoginForm successMessage="Inicio de sesión exitoso" />);
    expect(screen.getByText('Inicio de sesión exitoso')).toBeInTheDocument();
  });
});