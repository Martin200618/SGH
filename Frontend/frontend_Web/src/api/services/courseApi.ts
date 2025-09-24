import { COURSE_END_POINTS } from "../constants/Endpoint";

export interface Course {
  courseId: number;
  courseName: string;
  teacherSubjectId?: number;
  teacherId?: number;
  subjectId?: number;
  gradeDirectorId?: number;
}

export interface CreateCourseRequest {
  courseName: string;
  teacherSubjectId?: number;
  teacherId?: number;
  subjectId?: number;
  gradeDirectorId?: number;
}

export interface UpdateCourseRequest {
  courseName: string;
  teacherSubjectId?: number;
  teacherId?: number;
  subjectId?: number;
  gradeDirectorId?: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("Token en localStorage:", token);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetch(COURSE_END_POINTS, {
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
    console.error("Error al obtener cursos:", error.message);
    throw error;
  }
};

export const createCourse = async (course: CreateCourseRequest): Promise<Course> => {
  try {
    const response = await fetch(COURSE_END_POINTS, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al crear curso:", error.message);
    throw error;
  }
};

export const updateCourse = async (id: number, course: UpdateCourseRequest): Promise<Course> => {
  try {
    console.log("Actualizando curso con ID:", id, "Datos:", course);
    const headers = getAuthHeaders();
    console.log("Headers enviados:", headers);
    const response = await fetch(`${COURSE_END_POINTS}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(course),
    });
    console.log("Respuesta del servidor:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.log("Datos de error:", errorData);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al actualizar curso:", error.message);
    throw error;
  }
};

export const deleteCourse = async (id: number): Promise<void> => {
  try {
    console.log("Eliminando curso con ID:", id);
    const headers = getAuthHeaders();
    console.log("Headers enviados:", headers);
    const response = await fetch(`${COURSE_END_POINTS}/${id}`, {
      method: "DELETE",
      headers,
    });
    console.log("Respuesta del servidor:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.log("Datos de error:", errorData);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error al eliminar curso:", error.message);
    throw error;
  }
};