import React from 'react';
import { render } from '@testing-library/react-native';
import SchedulesScreen from '../SchedulesScreen';

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    token: 'test',
    loading: false,
  }),
}));

// Mock API services
jest.mock('../../api/services/scheduleCrudService', () => ({
  getAllSchedules: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../../api/services/courseCrudService', () => ({
  getAllCourses: jest.fn(() => Promise.resolve([])),
}));

describe('SchedulesScreen component', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(<SchedulesScreen />);

    expect(getByText('Gimnasio Americano ABC')).toBeTruthy();
  });
});