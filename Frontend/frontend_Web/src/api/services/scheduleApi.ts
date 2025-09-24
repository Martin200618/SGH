import { SCHEDULE_CRUD_END_POINTS, API_BASE_URL } from "../constants/Endpoint";

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

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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

export const createSchedule = async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
  try {
    const response = await fetch(SCHEDULE_CRUD_END_POINTS, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify([schedule]), // Enviar como array
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data[0]; // Retornar el primer elemento
  } catch (error: any) {
    console.error("Error al crear horario:", error.message);
    throw error;
  }
};

export interface ScheduleHistory {
  id: number;
  executedBy: string;
  executedAt: string;
  status: string;
  totalGenerated: number;
  message: string;
  periodStart: string;
  periodEnd: string;
  dryRun: boolean;
  force: boolean;
  params?: string;
}

export const generateSchedule = async (request: {
  periodStart: string;
  periodEnd: string;
  dryRun: boolean;
  force: boolean;
  params?: string;
}): Promise<ScheduleHistory> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/generate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al generar horario:", error.message);
    throw error;
  }
};

export const getScheduleHistory = async (page: number = 0, size: number = 10): Promise<{
  content: ScheduleHistory[];
  totalElements: number;
  totalPages: number;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/history?page=${page}&size=${size}`, {
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
    console.error("Error al obtener historial:", error.message);
    throw error;
  }
};