import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, ActivityIndicator, Image, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getAllSchedules } from '../api/services/scheduleCrudService';
import { getAllCourses } from '../api/services/courseCrudService';
import { ScheduleDTO } from '../api/types/schedules';
import { CourseDTO } from '../api/types/courses';
import ScheduleCard from '../components/Schedules/ScheduleCard';
import Pagination from '../components/Schedules/Pagination';
import SearchBar from '../components/Schedules/SearchBar';
import { styles } from '../styles/schedulesStyles';

interface CourseGroup {
  courseId: number;
  schedules: ScheduleDTO[];
}

export default function SchedulesScreen() {
  const { token, loading: authLoading } = useAuth();
  const [allCourses, setAllCourses] = useState<CourseDTO[]>([]);
  const [allSchedules, setAllSchedules] = useState<CourseGroup[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseGroup[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const [loading, setLoading] = useState(false);

  // 🔹 Traer cursos
  useEffect(() => {
    if (authLoading || !token) return;
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses(token);
        setAllCourses(data);
      } catch (err) {
        console.error('Error fetching courses', err);
      }
    };
    fetchCourses();
  }, [token, authLoading]);

  // 🔹 Traer horarios y agrupar por courseId
  useEffect(() => {
    if (authLoading || !token) return;
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const data = await getAllSchedules(token);

        const grouped: Record<number, ScheduleDTO[]> = {};
        (data ?? []).forEach((s) => {
          if (!grouped[s.courseId]) grouped[s.courseId] = [];
          grouped[s.courseId].push(s);
        });

        const coursesGrouped: CourseGroup[] = Object.keys(grouped).map((id) => ({
          courseId: Number(id),
          schedules: grouped[Number(id)],
        }));

        setAllSchedules(coursesGrouped);
        setFilteredCourses(coursesGrouped);
      } catch (err) {
        console.error('Error fetching schedules', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [token, authLoading]);

  // 🔹 Diccionario id → courseName
  const courseNameById = useMemo(() => {
    const map = new Map<number, string>();
    allCourses.forEach((c) => {
      if (c.courseName) map.set(c.courseId, c.courseName);
    });
    return map;
  }, [allCourses]);

  // 🔹 Filtro por nombre de curso
  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFilteredCourses(allSchedules);
      setCurrentPage(0);
      return;
    }
    const filtered = allSchedules.filter((c) => {
      const name = courseNameById.get(c.courseId) ?? '';
      return name.toLowerCase().includes(term);
    });
    setFilteredCourses(filtered);
    setCurrentPage(0);
  }, [search, allSchedules, courseNameById]);

  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const paginatedData = filteredCourses.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // 🔹 Obtener nombre real del curso desde la BD
  const getCourseName = (courseId: number) => {
    return courseNameById.get(courseId) ?? '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Gimnasio Americano ABC</Text>
      </View>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar curso..."
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            style={styles.listContainer}
            data={paginatedData}
            keyExtractor={(item) => item.courseId.toString()}
            renderItem={({ item }) => (
              <ScheduleCard course={item} getCourseName={getCourseName} />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No hay cursos ni horarios para mostrar.
              </Text>
            }
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </View>
  );
}
