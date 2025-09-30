import React from 'react';
import { render } from '@testing-library/react-native';
import StatCard from '../StatCard';

describe('StatCard component', () => {
  it('renders the number and label correctly', () => {
    const { getByText } = render(
      <StatCard
        number="80+"
        label="Niños creciendo felices"
        icon={require('../../../assets/images/trophy.png')}
      />
    );

    expect(getByText('80+')).toBeTruthy();
    expect(getByText('Niños creciendo felices')).toBeTruthy();
  });
});