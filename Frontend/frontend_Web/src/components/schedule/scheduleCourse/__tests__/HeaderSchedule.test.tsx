import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderSchedule from '../HeaderSchedule';

describe('HeaderSchedule Component', () => {
  test('renders header with title and description', () => {
    render(<HeaderSchedule />);

    expect(screen.getByText('Horarios 👨‍🏫')).toBeInTheDocument();
    expect(screen.getByText('Gestiona la generación y visualización de horarios.')).toBeInTheDocument();
  });
});