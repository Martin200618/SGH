import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Image, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getAllSchedules } from '../api/services/scheduleCrudService';
import { ScheduleDTO } from '../api/types/schedules';
import ScheduleCard from '../components/Schedules/ScheduleCard';
import Pagination from '../components/Schedules/Pagination';
import SearchBar from '../components/Schedules/SearchBar';
import { styles } from '../styles/schedulesStyles';

export default function SchedulesScreen() {
  const { token } = useAuth();
  const [allSchedules, setAllSchedules] = useState<ScheduleDTO[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleDTO[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await getAllSchedules(token);
        setAllSchedules(data);
        setFilteredSchedules(data);
      } catch (err) {
        console.error('Error fetching schedules', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [token]);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFilteredSchedules(allSchedules);
      setCurrentPage(0);
      return;
    }
    const filtered = allSchedules.filter((s) => {
      const subject = s.subjectName?.toLowerCase() ?? '';
      const teacher = s.teacherName?.toLowerCase() ?? '';
      const course = s.courseName?.toLowerCase() ?? '';
      return subject.includes(term) || teacher.includes(term) || course.includes(term);
    });
    setFilteredSchedules(filtered);
    setCurrentPage(0);
  }, [search, allSchedules]);

  const totalPages = Math.ceil(filteredSchedules.length / pageSize);
  const paginatedData = filteredSchedules.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Gimnasio Americano ABC</Text>
      </View>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar curso, materia o profesor..."
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            style={styles.listContainer}
            data={paginatedData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ScheduleCard item={item} />}
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
