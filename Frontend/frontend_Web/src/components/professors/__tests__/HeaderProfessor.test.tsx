import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeaderProfessor from '../HeaderProfessor';

describe('HeaderProfessor Component', () => {
  const mockOnAddProfessor = jest.fn();

  test('renders header with title and description', () => {
    render(<HeaderProfessor onAddProfessor={mockOnAddProfessor} />);

    expect(screen.getByText('Profesores 👨‍🏫')).toBeInTheDocument();
    expect(screen.getByText('Gestiona la información de los profesores aquí.')).toBeInTheDocument();
  });

  test('renders add professor button', () => {
    render(<HeaderProfessor onAddProfessor={mockOnAddProfessor} />);

    expect(screen.getByText('Agregar Profesor')).toBeInTheDocument();
  });

  test('calls onAddProfessor when button is clicked', () => {
    render(<HeaderProfessor onAddProfessor={mockOnAddProfessor} />);

    const button = screen.getByText('Agregar Profesor');
    fireEvent.click(button);

    expect(mockOnAddProfessor).toHaveBeenCalledTimes(1);
  });
});