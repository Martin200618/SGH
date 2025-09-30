import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Pagination from '../Pagination';

describe('Pagination component', () => {
  it('renders the pagination correctly', () => {
    const { getByText } = render(
      <Pagination currentPage={0} totalPages={3} onPageChange={() => {}} />
    );

    expect(getByText('Anterior')).toBeTruthy();
    expect(getByText('1 / 3')).toBeTruthy();
    expect(getByText('Siguiente')).toBeTruthy();
  });

  it('calls onPageChange when next button is pressed', () => {
    const mockOnPageChange = jest.fn();

    const { getByText } = render(
      <Pagination currentPage={0} totalPages={3} onPageChange={mockOnPageChange} />
    );

    fireEvent.press(getByText('Siguiente'));

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });
});