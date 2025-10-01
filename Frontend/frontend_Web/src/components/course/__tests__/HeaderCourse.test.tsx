import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeaderCourse from '../HeaderCourse';

describe('HeaderCourse Component', () => {
  const mockOnAddCourse = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header with title and description', () => {
    render(<HeaderCourse onAddCourse={mockOnAddCourse} />);

    expect(screen.getByText('Cursos 👨‍🏫')).toBeInTheDocument();
    expect(screen.getByText('Gestiona la información de los cursos aquí.')).toBeInTheDocument();
  });

  test('renders add course button', () => {
    render(<HeaderCourse onAddCourse={mockOnAddCourse} />);

    const addButton = screen.getByText('Agregar Curso');
    expect(addButton).toBeInTheDocument();
  });

  test('calls onAddCourse when button is clicked', () => {
    render(<HeaderCourse onAddCourse={mockOnAddCourse} />);

    const addButton = screen.getByText('Agregar Curso');
    fireEvent.click(addButton);

    expect(mockOnAddCourse).toHaveBeenCalledTimes(1);
  });
});