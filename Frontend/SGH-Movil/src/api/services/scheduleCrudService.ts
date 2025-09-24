import { API_URL } from '../constant/api';
import { ScheduleDTO } from '../types/schedules';

// Obtener todos los horarios
export async function getAllSchedules(token: string): Promise<ScheduleDTO[]> {
  const response = await fetch(`${API_URL}/schedules-crud`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as ScheduleDTO[] | { error?: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Failed to fetch schedules');
  }

  return data as ScheduleDTO[];
}

// Obtener horarios por curso
export async function getSchedulesByCourse(token: string, courseId: number): Promise<ScheduleDTO[]> {
  const response = await fetch(`${API_URL}/schedules-crud/by-course/${courseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as ScheduleDTO[] | { error?: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Failed to fetch schedules by course');
  }

  return data as ScheduleDTO[];
}

// Obtener horarios por profesor
export async function getSchedulesByTeacher(token: string, teacherId: number): Promise<ScheduleDTO[]> {
  const response = await fetch(`${API_URL}/schedules-crud/by-teacher/${teacherId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as ScheduleDTO[] | { error?: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Failed to fetch schedules by teacher');
  }

  return data as ScheduleDTO[];
}
