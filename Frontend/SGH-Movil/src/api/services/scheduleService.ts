import { API_URL } from '../constant/api';
import { ScheduleHistory } from '../types/schedules';

export async function getScheduleHistory(
  token: string,
  page = 0,
  size = 10
): Promise<ScheduleHistory[]> {
  const response = await fetch(`${API_URL}/schedules/history?page=${page}&size=${size}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch schedule history');
  }

  // Spring devuelve un Page<DTO>, así que los datos están en `content`
  return data.content as ScheduleHistory[];
}
