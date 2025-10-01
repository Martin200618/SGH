import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseModal from '../CourseModal';

const mockTeachers = [
  { teacherId: 1, teacherName: 'Profesor García', subjectId: 1 },
  { teacherId: 2, teacherName: 'Profesora López', subjectId: 2 },
];

const mockCourse = {
  courseId: 1,
  courseName: 'Matemáticas1',
  gradeDirectorId: 1,
};

describe('CourseModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <CourseModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        teachers={mockTeachers}
      />
    );

    expect(screen.getByText('Agregar Curso')).toBeInTheDocument();
    expect(screen.getByText('Ingresa la información del nuevo curso')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    render(
      <CourseModal
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        teachers={mockTeachers}
      />
    );

    expect(screen.queryByText('Agregar Curso')).not.toBeInTheDocument();
  });

  test('renders edit mode when course is provided', () => {
    render(
      <CourseModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        course={mockCourse}
        teachers={mockTeachers}
      />
    );

    expect(screen.getByText('Editar Curso')).toBeInTheDocument();
    expect(screen.getByText('Modifica la información del curso')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Matemáticas1')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    render(
      <CourseModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        teachers={mockTeachers}
      />
    );

    // Find the close button by its position (first button in the header)
    const closeButton = screen.getAllByRole('button')[0];
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('closes modal when cancel button is clicked', () => {
    render(
      <CourseModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        teachers={mockTeachers}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('shows validation error for empty course name', async () => {
    render(
      <CourseModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        teachers={mockTeachers}
      />
    );

    const saveButton = screen.getByText('Crear Curso');
    fireEvent.click(saveButton);

    expect(screen.getByText('El nombre del curso es obligatorio')).toBeInTheDocument();
  });

  test('shows validation error for invalid course name', async () => {
    render(
      <CourseModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        teachers={mockTeachers}
      />
    );

    const nameInput = screen.getByPlaceholderText('Ingresa el nombre del curso');
    await userEvent.type(nameInput, 'Curso@123');

    const saveButton = screen.getByText('Crear Curso');
    fireEvent.click(saveButton);

    expect(screen.getByText('El nombre del curso solo puede contener letras, números y espacios')).toBeInTheDocument();
  });

  test('saves course with valid data', async () => {
    render(
      <CourseModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        teachers={mockTeachers}
      />
    );

    const nameInput = screen.getByPlaceholderText('Ingresa el nombre del curso');
    await userEvent.type(nameInput, 'Matemáticas Básicas');

    const directorSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(directorSelect, '1');

    const saveButton = screen.getByText('Crear Curso');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        courseName: 'Matemáticas Básicas',
        gradeDirectorId: 1,
      });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  test('renders teacher options in select', () => {
    render(
      <CourseModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        teachers={mockTeachers}
      />
    );

    const directorSelect = screen.getByRole('combobox');
    expect(directorSelect).toBeInTheDocument();

    expect(screen.getByText('Selecciona un director (opcional)')).toBeInTheDocument();
    expect(screen.getByText('Profesor García')).toBeInTheDocument();
    expect(screen.getByText('Profesora López')).toBeInTheDocument();
  });
});