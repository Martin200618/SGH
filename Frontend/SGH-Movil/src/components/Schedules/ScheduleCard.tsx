import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleDTO } from '../../api/types/schedules';
import { styles } from '../../styles/schedulesStyles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CourseGroup {
  courseId: number;
  schedules: ScheduleDTO[];
}

interface Props {
  course: CourseGroup;
  getCourseName: (id: number) => string;
}

export default function ScheduleCard({ course, getCourseName }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <TouchableOpacity style={styles.courseItem} onPress={toggleExpand} activeOpacity={0.8}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        {/* Encabezado: nombre del curso */}
        <Text style={styles.courseText}>{getCourseName(course.courseId)}</Text>

        {/* Si está expandido, mostrar todos los horarios */}
        {expanded && (
          <View style={{ marginTop: 10 }}>
            {course.schedules.map((s) => (
              <View key={s.id} style={{ marginBottom: 8 }}>
                <Text style={styles.courseText}>
                  📘 Materia: {s.subjectName || 'No asignada'}
                </Text>
                <Text style={styles.courseText}>
                  👨‍🏫 Profesor: {s.teacherName || 'No asignado'}
                </Text>
                <Text style={styles.courseText}>
                  🕒 Horario: {s.day || 'Día no definido'} {s.startTime || '--:--'} - {s.endTime || '--:--'}
                </Text>
              </View>
            ))}
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
