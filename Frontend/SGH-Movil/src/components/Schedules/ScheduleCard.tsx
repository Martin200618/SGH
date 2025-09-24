import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleDTO } from '../../api/types/schedules';
import { styles } from '../../styles/schedulesStyles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  item: ScheduleDTO;
}

export default function ScheduleCard({ item }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <TouchableOpacity style={styles.courseItem} onPress={toggleExpand} activeOpacity={0.8}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={styles.courseText}>
          {item.subjectName} - {item.teacherName}
        </Text>
        <Text style={styles.courseText}>{item.courseName}</Text>
        <Text style={styles.courseText}>
          {item.day} {item.startTime} - {item.endTime}
        </Text>

        {expanded && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.courseText}>📘 Materia: {item.subjectName}</Text>
            <Text style={styles.courseText}>👨‍🏫 Profesor: {item.teacherName}</Text>
            <Text style={styles.courseText}>🏫 Curso: {item.courseName}</Text>
            <Text style={styles.courseText}>
              🕒 Horario: {item.day} {item.startTime} - {item.endTime}
            </Text>
          </View>
        )}
      </View>

      <Ionicons
        name={expanded ? 'chevron-down' : 'chevron-forward'}
        size={20}
        color="#2E3A59"
        style={styles.arrowIcon as any}
      />
    </TouchableOpacity>
  );
}
