import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getScheduleHistory } from '../api/services/scheduleService';
import { ScheduleHistory } from '../api/types/schedules';
import { useAuth } from '../context/AuthContext';

export default function SchedulesScreen() {
  const { token } = useAuth();
  const [history, setHistory] = useState<ScheduleHistory[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      // ✅ Validamos que el token exista antes de llamar al servicio
      if (!token) return;

      try {
        const data = await getScheduleHistory(token);
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history', err);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 15,
              padding: 10,
              backgroundColor: '#f5f5f5',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.status}</Text>
            <Text>Executed by: {item.executedBy}</Text>
            <Text>At: {new Date(item.executedAt).toLocaleString()}</Text>
            <Text>Total generated: {item.totalGenerated}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}
