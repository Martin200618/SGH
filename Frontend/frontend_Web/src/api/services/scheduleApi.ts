import { SCHEDULE_CRUD_END_POINTS } from "../constants/Enpoint";

export interface Schedule {
  id: number;
  courseId: number;
  teacherId?: number;
  subjectId?: number;
  day: string;
  startTime: string;
  endTime: string;
  scheduleName: string;
  teacherName?: string;
  subjectName?: string;
}

export const getAllSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await fetch(SCHEDULE_CRUD_END_POINTS, {
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
    console.error("Error al obtener horarios:", error.message);
    throw error;
  }
};

export const getSchedulesByCourse = async (courseId: number): Promise<Schedule[]> => {
  try {
    const response = await fetch(`${SCHEDULE_CRUD_END_POINTS}/by-course/${courseId}`, {
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
    console.error("Error al obtener horarios por curso:", error.message);
    throw error;
  }
};