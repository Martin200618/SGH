import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleDTO } from '../../api/types/schedules';
import { styles } from '../../styles/schedulesStyles';
import { DAYS_ORDER } from '../../api/types/days';

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

  // Agrupar por día
  const groupedByDay: Record<string, ScheduleDTO[]> = {};
  course.schedules.forEach((s) => {
    if (!groupedByDay[s.day]) groupedByDay[s.day] = [];
    groupedByDay[s.day].push(s);
  });

  // Ordenar días según DAYS_ORDER
  const sortedDays = Object.keys(groupedByDay).sort(
    (a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b)
  );

  return (
    <TouchableOpacity style={styles.courseItem} onPress={toggleExpand} activeOpacity={0.8}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        {/* Encabezado: nombre del curso */}
        <Text style={styles.courseText}>{getCourseName(course.courseId)}</Text>

        {/* Si está expandido, mostrar horarios agrupados */}
        {expanded && (
          <View style={{ marginTop: 10 }}>
            {sortedDays.map((day) => (
              <View key={day} style={{ marginBottom: 12 }}>
                {/* Línea separadora con el nombre del día */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 6,
                }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                  <Text style={{ marginHorizontal: 8, fontWeight: 'bold', color: '#2E3A59' }}>
                    {day}
                  </Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                </View>

                {/* Horarios de ese día, ordenados por hora */}
                {groupedByDay[day]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((s) => (
                    <View key={s.id} style={{ marginBottom: 6 }}>
                      <Text style={styles.courseText}>📘 Materia: {s.subjectName}</Text>
                      <Text style={styles.courseText}>👨‍🏫 Profesor: {s.teacherName}</Text>
                      <Text style={styles.courseText}>
                        🕒 {s.startTime} - {s.endTime}
                      </Text>
                    </View>
                  ))}
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
