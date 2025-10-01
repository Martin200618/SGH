import React from 'react';
import { render, screen } from '@testing-library/react';
import TeacherCard from '../TeacherCard';

describe('TeacherCard Component', () => {
  test('renders teacher name', () => {
    render(<TeacherCard name="María García" />);

    expect(screen.getByText('María García')).toBeInTheDocument();
  });

  test('renders teacher title', () => {
    render(<TeacherCard name="María García" />);

    expect(screen.getByText('Profesor')).toBeInTheDocument();
  });

  test('displays first letter of name as avatar', () => {
    render(<TeacherCard name="María García" />);

    expect(screen.getByText('M')).toBeInTheDocument();
  });

  test('capitalizes first letter correctly', () => {
    render(<TeacherCard name="juan perez" />);

    expect(screen.getByText('J')).toBeInTheDocument();
  });
});