import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomAlert from '../CustomAlert';

describe('CustomAlert component', () => {
  it('renders the title and message correctly', () => {
    const { getByText } = render(
      <CustomAlert visible={true} title="Test Title" message="Test Message" onClose={() => {}} />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
  });

  it('calls onClose when OK button is pressed', () => {
    const mockOnClose = jest.fn();

    const { getByText } = render(
      <CustomAlert visible={true} title="Title" message="Message" onClose={mockOnClose} />
    );

    fireEvent.press(getByText('OK'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});