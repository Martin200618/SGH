import React from 'react';
import { render } from '@testing-library/react-native';
import LoginHeader from '../LoginHeader';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('LoginHeader component', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<LoginHeader />);

    expect(toJSON()).toBeTruthy();
  });
});