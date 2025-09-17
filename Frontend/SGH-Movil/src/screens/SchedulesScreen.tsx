import React, { useState } from 'react';
import { View, Image, FlatList, Text, ListRenderItem } from 'react-native';
import { styles } from '../styles/schedulesStyles';
import SearchBar from '../components/Schedules/SearchBar';
import ScheduleItem from '../components/Schedules/ScheduleItem';
import Pagination from '../components/Schedules/Pagination';
import { Course } from '../api/types/schedules';

export default function SchedulesScreen() {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  // Datos mock tipados (luego se reemplazan por fetch real)
  const courses: Course[] = [
    { id: 1, name: 'Curso 1A' },
    { id: 2, name: 'Curso 1B' },
    { id: 3, name: 'Curso 2A' },
    { id: 4, name: 'Curso 2B' },
    { id: 5, name: 'Curso 3' },
    { id: 6, name: 'Curso 4' },
    { id: 7, name: 'Curso 5' },
    { id: 8, name: 'Curso 6' }
  ];

  const pageSize = 5;
  const totalPages = Math.ceil(courses.length / pageSize);

  const filtered: Course[] = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated: Course[] = filtered.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const renderItem: ListRenderItem<Course> = ({ item }) => (
    <ScheduleItem course={item} onPress={() => {}} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Gimnasio Americano ABC</Text>
      </View>

      {/* Barra de búsqueda */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Lista paginada */}
      <FlatList<Course>
        data={paginated}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Paginación */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage(p => Math.max(p - 1, 0))}
        onNext={() => setPage(p => Math.min(p + 1, totalPages - 1))}
      />
    </View>
  );
}
