import { SUBJECT_END_POINTS } from "../constants/Endpoint";
import Cookies from 'js-cookie';

export interface Subject {
  subjectId: number;
  subjectName: string;
  profesoresAsociados?: number;
}

export interface CreateSubjectRequest {
  subjectName: string;
}

export interface UpdateSubjectRequest {
  subjectName: string;
}

const getAuthHeaders = () => {
  const token = Cookies.get("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getAllSubjects = async (): Promise<Subject[]> => {
  try {
    const response = await fetch(SUBJECT_END_POINTS, {
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
    console.error("Error al obtener materias:", error.message);
    throw error;
  }
};

export const createSubject = async (subject: CreateSubjectRequest): Promise<Subject> => {
  try {
    const response = await fetch(SUBJECT_END_POINTS, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(subject),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al crear materia:", error.message);
    throw error;
  }
};

export const updateSubject = async (id: number, subject: UpdateSubjectRequest): Promise<Subject> => {
  try {
    const response = await fetch(`${SUBJECT_END_POINTS}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(subject),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al actualizar materia:", error.message);
    throw error;
  }
};

export const deleteSubject = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${SUBJECT_END_POINTS}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error al eliminar materia:", error.message);
    throw error;
  }
};