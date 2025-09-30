import React from 'react';
import { render } from '@testing-library/react-native';
import InfoCard from '../InfoCard';

describe('InfoCard component', () => {
  it('renders the items correctly', () => {
    const items = ['Item 1', 'Item 2'];

    const { getByText } = render(<InfoCard items={items} />);

    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
  });
});