import { API_URL } from '../constant/api';
import { CourseDTO } from '../types/courses';

export async function getAllCourses(token: string | null): Promise<CourseDTO[]> {
  if (!token) {
    console.warn("⚠️ No token provided to getAllCourses");
    return [];
  }

  const response = await fetch(`${API_URL}/courses`, { // 👈 corregido endpoint
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as CourseDTO[] | { error?: string };

  if (!response.ok) {
    console.error("❌ Error fetching courses:", data);
    throw new Error((data as any).error || 'Failed to fetch courses');
  }

  return data as CourseDTO[];
}
