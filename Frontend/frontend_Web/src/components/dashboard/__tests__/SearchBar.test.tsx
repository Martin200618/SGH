import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input with default placeholder', () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Buscar...');
    expect(input).toBeInTheDocument();
  });

  test('renders search input with custom placeholder', () => {
    render(<SearchBar placeholder="Buscar profesores..." />);

    const input = screen.getByPlaceholderText('Buscar profesores...');
    expect(input).toBeInTheDocument();
  });

  test('calls onSearch when input changes', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Buscar...');
    await userEvent.type(input, 'test search');

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  test('trims whitespace when calling onSearch', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Buscar...');
    await userEvent.type(input, '  test search  ');

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  test('updates input value when typing', async () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Buscar...');
    await userEvent.type(input, 'hello');

    expect(input).toHaveValue('hello');
  });
});