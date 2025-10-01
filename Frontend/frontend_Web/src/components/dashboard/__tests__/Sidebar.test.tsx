import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../Sidebar';

// Mock de Next.js hooks
const mockPush = jest.fn();
const mockPathname = '/dashboard';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

// Mock de js-cookie
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  remove: jest.fn(),
}));

// Mock de fetch
global.fetch = jest.fn();

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });
  });

  test('renders sidebar with logo and title', () => {
    render(<Sidebar />);

    expect(screen.getByText('ABC')).toBeInTheDocument();
    expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  test('renders all main menu items', () => {
    render(<Sidebar />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Profesores')).toBeInTheDocument();
    expect(screen.getByText('Materias')).toBeInTheDocument();
    expect(screen.getByText('Cursos')).toBeInTheDocument();
    expect(screen.getByText('Horarios')).toBeInTheDocument();
  });

  test('renders logout button', () => {
    render(<Sidebar />);

    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  test('navigates to correct path when menu item is clicked', () => {
    render(<Sidebar />);

    const generalButton = screen.getByText('General');
    fireEvent.click(generalButton);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  test('toggles submenu when Horarios is clicked', () => {
    render(<Sidebar />);

    const horariosButton = screen.getByText('Horarios');
    fireEvent.click(horariosButton);

    expect(screen.getByText('Generar Horario')).toBeInTheDocument();
    expect(screen.getByText('Horarios cursos')).toBeInTheDocument();
    expect(screen.getByText('Horarios Profesores')).toBeInTheDocument();
  });

  test('navigates to submenu item when clicked', () => {
    render(<Sidebar />);

    // First open the submenu
    const horariosButton = screen.getByText('Horarios');
    fireEvent.click(horariosButton);

    // Then click on a submenu item
    const generateScheduleButton = screen.getByText('Generar Horario');
    fireEvent.click(generateScheduleButton);

    expect(mockPush).toHaveBeenCalledWith('/dashboard/schedule');
  });

  test('shows logout confirmation modal when logout button is clicked', () => {
    render(<Sidebar />);

    const logoutButtons = screen.getAllByText('Cerrar Sesión');
    const logoutButton = logoutButtons[0]; // The main logout button
    fireEvent.click(logoutButton);

    expect(screen.getAllByText('Cerrar Sesión')).toHaveLength(2); // Button and modal title
    expect(screen.getByText('¿Estás seguro de que quieres cerrar la sesión?')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Aceptar')).toBeInTheDocument();
  });

  test('closes modal when cancel is clicked', () => {
    render(<Sidebar />);

    // Open modal
    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);

    // Click cancel
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    // Modal should be closed
    expect(screen.queryByText('¿Estás seguro de que quieres cerrar la sesión?')).not.toBeInTheDocument();
  });

  test('handles logout process', async () => {
    render(<Sidebar />);

    // Open modal
    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);

    // Click accept
    const acceptButton = screen.getByText('Aceptar');
    fireEvent.click(acceptButton);

    // Should show loading state
    expect(screen.getByText('Cerrando sesión...')).toBeInTheDocument();

    // Wait for logout to complete
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});