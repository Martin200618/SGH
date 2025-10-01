import { COURSE_END_POINTS } from "../constants/Endpoint";
import { getAuthHeaders } from "../utils/authUtils";
import { log } from "../../utils/logger";

export interface Course {
  courseId: number;
  courseName: string;
  teacherSubjectId?: number;
  teacherId?: number;
  subjectId?: number;
  gradeDirectorId?: number;
}

export interface CourseRequest {
  courseName: string;
  teacherSubjectId?: number;
  teacherId?: number;
  subjectId?: number;
  gradeDirectorId?: number;
}

export type CreateCourseRequest = Omit<CourseRequest, 'courseId'>;
export type UpdateCourseRequest = CourseRequest;

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
    log.error("Error al obtener cursos", error);
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
    log.error("Error al crear curso", error, { course });
    throw error;
  }
};

export const updateCourse = async (id: number, course: UpdateCourseRequest): Promise<Course> => {
  try {
    const response = await fetch(`${COURSE_END_POINTS}/${id}`, {
      method: "PUT",
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
    log.error("Error al actualizar curso", error, { id, course });
    throw error;
  }
};

export const deleteCourse = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${COURSE_END_POINTS}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }
  } catch (error: any) {
    log.error("Error al eliminar curso", error, { id });
    throw error;
  }
};