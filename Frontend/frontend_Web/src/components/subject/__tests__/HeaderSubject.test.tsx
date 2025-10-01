import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeaderSubject from '../HeaderSubject';

describe('HeaderSubject Component', () => {
  const mockOnAddSubject = jest.fn();

  test('renders header with title and description', () => {
    render(<HeaderSubject onAddSubject={mockOnAddSubject} />);

    expect(screen.getByText('Materias 📚')).toBeInTheDocument();
    expect(screen.getByText('Gestiona la información de las materias aquí.')).toBeInTheDocument();
  });

  test('renders add subject button', () => {
    render(<HeaderSubject onAddSubject={mockOnAddSubject} />);

    expect(screen.getByText('Agregar Materia')).toBeInTheDocument();
  });

  test('calls onAddSubject when button is clicked', () => {
    render(<HeaderSubject onAddSubject={mockOnAddSubject} />);

    const button = screen.getByText('Agregar Materia');
    fireEvent.click(button);

    expect(mockOnAddSubject).toHaveBeenCalledTimes(1);
  });
});