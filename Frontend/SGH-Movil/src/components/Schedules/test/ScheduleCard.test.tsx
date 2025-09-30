import React from 'react';
import { render } from '@testing-library/react-native';
import ScheduleCard from '../ScheduleCard';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

describe('ScheduleCard component', () => {
  it('renders the course name correctly', () => {
    const course = { courseId: 1, schedules: [] };
    const getCourseName = (id: number) => 'Test Course';

    const { getByText } = render(
      <ScheduleCard course={course} getCourseName={getCourseName} />
    );

    expect(getByText('Test Course')).toBeTruthy();
  });
});