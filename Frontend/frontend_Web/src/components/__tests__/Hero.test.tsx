import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

/// <reference types="@testing-library/jest-dom" />

describe('Hero Component', () => {
  test('renders the hero section with title', () => {
    render(<Hero />);
    const titleElement = screen.getByText(/Aprende en el/);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the login button', () => {
    render(<Hero />);
    const loginButton = screen.getByRole('link', { name: /Ingresar/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('href', '/login');
  });

  test('renders statistics', () => {
    render(<Hero />);
    expect(screen.getByText('80+')).toBeInTheDocument();
    expect(screen.getByText('Niños creciendo felices')).toBeInTheDocument();
    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('Actividades creativas al año')).toBeInTheDocument();
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('Profesores que enseñan con amor')).toBeInTheDocument();
  });

  test('renders logo image', () => {
    render(<Hero />);
    const logoImage = screen.getByAltText('Logo Colegio ABC');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/logo.png');
  });

  test('renders decorative images', () => {
    render(<Hero />);
    expect(screen.getByAltText('Trophy')).toBeInTheDocument();
    expect(screen.getByAltText('Rocket')).toBeInTheDocument();
    expect(screen.getByAltText('Blue Circle')).toBeInTheDocument();
    expect(screen.getByAltText('Orange Circle')).toBeInTheDocument();
    expect(screen.getByAltText('Yellow Circle')).toBeInTheDocument();
    expect(screen.getByAltText('Purple Circle')).toBeInTheDocument();
  });
});