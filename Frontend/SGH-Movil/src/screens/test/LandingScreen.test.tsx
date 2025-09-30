import React from 'react';
import { render } from '@testing-library/react-native';
import LandingScreen from '../LandingScreen';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('LandingScreen component', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(<LandingScreen />);

    expect(getByText('Gimnasio Americano ABC')).toBeTruthy();
  });
});