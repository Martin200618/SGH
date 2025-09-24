import { TEACHER_END_POINTS, API_BASE_URL } from "../constants/Endpoint";

export interface Teacher {
  teacherId: number;
  teacherName: string;
  subjectId: number;
  availabilitySummary?: string;
}

export interface CreateTeacherRequest {
  teacherName: string;
  subjectId: number;
}

export interface UpdateTeacherRequest {
  teacherName: string;
  subjectId: number;
}

export interface TeacherAvailabilityDTO {
  teacherId: number;
  day: string;
  amStart: string | null;
  amEnd: string | null;
  pmStart: string | null;
  pmEnd: string | null;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("Token en localStorage:", token);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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

export const createTeacher = async (teacher: CreateTeacherRequest): Promise<Teacher> => {
  try {
    const response = await fetch(TEACHER_END_POINTS, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(teacher),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al crear profesor:", error.message);
    throw error;
  }
};

export const updateTeacher = async (id: number, teacher: UpdateTeacherRequest): Promise<Teacher> => {
  try {
    const response = await fetch(`${TEACHER_END_POINTS}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(teacher),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al actualizar profesor:", error.message);
    throw error;
  }
};

export const deleteTeacher = async (id: number): Promise<void> => {
  try {
    console.log("Intentando eliminar profesor con ID:", id);
    const response = await fetch(`${TEACHER_END_POINTS}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    console.log("Respuesta del servidor:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.log("Datos de error:", errorData);
      throw new Error(`Error ${response.status}: ${errorData?.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error("Error al eliminar profesor:", error.message);
    throw error;
  }
};

export const registerAvailability = async (availability: TeacherAvailabilityDTO): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/availability/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(availability),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.text();
    return data;
  } catch (error: any) {
    console.error("Error al registrar disponibilidad:", error.message);
    throw error;
  }
};

export interface TeacherAvailability {
  id: number;
  teacherId: number;
  day: string;
  amStart: string | null;
  amEnd: string | null;
  pmStart: string | null;
  pmEnd: string | null;
  endTime: string;
}

export const getTeacherAvailability = async (teacherId: number): Promise<TeacherAvailability[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/availability/by-teacher/${teacherId}`, {
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
    console.error("Error al obtener disponibilidad:", error.message);
    throw error;
  }
};

export const updateAvailability = async (availability: TeacherAvailabilityDTO): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/availability/update`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(availability),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.text();
    return data;
  } catch (error: any) {
    console.error("Error al actualizar disponibilidad:", error.message);
    throw error;
  }
};