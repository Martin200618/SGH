import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/schedulesStyles';
import { Course } from '../../api/types/schedules';

export interface ScheduleItemProps {
  course: Course;
  onPress?: () => void;
}

export default function ScheduleItem({ course, onPress }: ScheduleItemProps) {
  return (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.courseText}>{course.name}</Text>
      <Image
        source={require('../../assets/images/arrow-down.png')}
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );
}
