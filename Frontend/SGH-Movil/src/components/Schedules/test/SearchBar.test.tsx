import React from 'react';
import { render } from '@testing-library/react-native';
import SearchBar from '../SearchBar';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

describe('SearchBar component', () => {
  it('renders the search input correctly', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChange={() => {}} placeholder="Buscar curso..." />
    );

    expect(getByPlaceholderText('Buscar curso...')).toBeTruthy();
  });
});