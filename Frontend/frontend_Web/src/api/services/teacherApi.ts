import { TEACHER_END_POINTS } from "../constants/Enpoint";

export interface Teacher {
  teacherId: number;
  teacherName: string;
  subjectId: number;
}

export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await fetch(TEACHER_END_POINTS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al obtener profesores:", error.message);
    throw error;
  }
};