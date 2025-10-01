import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableCourse from '../TableCourse';

const mockCourses = [
  {
    courseId: 1,
    courseName: 'Matemáticas2',
    gradeDirectorId: 1,
    directorName: 'Profesor García',
  },
  {
    courseId: 2,
    courseName: 'Lenguaje1',
    gradeDirectorId: 2,
    directorName: 'Profesora López',
  },
  {
    courseId: 3,
    courseName: 'Ciencias3',
    directorName: 'Profesor Martínez',
  },
];

describe('TableCourse Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders table with courses', () => {
    render(
      <TableCourse
        courses={mockCourses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Matemáticas2')).toBeInTheDocument();
    expect(screen.getByText('Lenguaje1')).toBeInTheDocument();
    expect(screen.getByText('Ciencias3')).toBeInTheDocument();
  });

  test('renders table headers', () => {
    render(
      <TableCourse
        courses={mockCourses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Grado')).toBeInTheDocument();
    expect(screen.getByText('Director de curso')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  test('displays grade names correctly', () => {
    render(
      <TableCourse
        courses={mockCourses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Segundo')).toBeInTheDocument();
    expect(screen.getByText('Primero')).toBeInTheDocument();
    expect(screen.getByText('Tercero')).toBeInTheDocument();
  });

  test('displays director names', () => {
    render(
      <TableCourse
        courses={mockCourses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Profesor García')).toBeInTheDocument();
    expect(screen.getByText('Profesora López')).toBeInTheDocument();
    expect(screen.getByText('Profesor Martínez')).toBeInTheDocument();
  });

  test('displays "Sin asignar" for courses without director', () => {
    const coursesWithoutDirector = [
      {
        courseId: 1,
        courseName: 'Matemáticas1',
      },
    ];

    render(
      <TableCourse
        courses={coursesWithoutDirector}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Sin asignar')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <TableCourse
        courses={mockCourses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByText('Editar');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(3);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <TableCourse
        courses={mockCourses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(3);
  });

  test('sorts courses by name and grade', () => {
    const unsortedCourses = [
      { courseId: 3, courseName: 'Ciencias1', directorName: 'Profesor A' },
      { courseId: 1, courseName: 'Matemáticas2', directorName: 'Profesor B' },
      { courseId: 2, courseName: 'Lenguaje1', directorName: 'Profesor C' },
    ];

    render(
      <TableCourse
        courses={unsortedCourses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const courseNames = screen.getAllByText(/Ciencias1|Matemáticas2|Lenguaje1/);
    // Should be sorted: Ciencias1, Lenguaje1, Matemáticas2 (alphabetical by prefix)
    expect(courseNames[0]).toHaveTextContent('Ciencias1');
    expect(courseNames[1]).toHaveTextContent('Lenguaje1');
    expect(courseNames[2]).toHaveTextContent('Matemáticas2');
  });

  test('displays empty state when no courses', () => {
    render(
      <TableCourse
        courses={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No hay cursos registrados')).toBeInTheDocument();
  });

  test('renders action buttons for each course', () => {
    render(
      <TableCourse
        courses={mockCourses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Eliminar');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });
});