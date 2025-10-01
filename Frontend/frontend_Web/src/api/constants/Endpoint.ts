import { config } from '../../config/env';

/**
 * Endpoints de la API organizados por módulo
 */
export const API_BASE_URL = config.apiBaseUrl;

export const USER_END_POINTS = `${API_BASE_URL}/auth`;
export const TEACHER_END_POINTS = `${API_BASE_URL}/teachers`;
export const SUBJECT_END_POINTS = `${API_BASE_URL}/subjects`;
export const COURSE_END_POINTS = `${API_BASE_URL}/courses`;
export const SCHEDULE_CRUD_END_POINTS = `${API_BASE_URL}/schedules-crud`;
