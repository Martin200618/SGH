import React, { useState, useEffect } from 'react';
import { X, BookOpen, User } from 'lucide-react';
import { Teacher } from '@/api/services/teacherApi';

/**
 * Interfaz que representa un curso en el sistema
 */
interface Course {
  /** ID único del curso */
  courseId: number;
  /** Nombre del curso */
  courseName: string;
  /** ID de la relación profesor-materia (opcional) */
  teacherSubjectId?: number;
  /** ID del profesor (opcional) */
  teacherId?: number;
  /** ID de la materia (opcional) */
  subjectId?: number;
  /** ID del director de grado (opcional) */
  gradeDirectorId?: number;
}

/**
 * Props para el componente CourseModal
 */
interface CourseModalProps {
  /** Indica si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Función para guardar el curso (crear o actualizar) */
  onSave: (course: Omit<Course, 'courseId'>) => Promise<void>;
  /** Curso existente para editar (null para crear nuevo) */
  course?: Course | null;
  /** Lista de profesores disponibles */
  teachers: Teacher[];
}

/**
 * Modal para crear o editar cursos
 *
 * Proporciona un formulario con validación para gestionar cursos.
 * Incluye campos para nombre del curso y selección de director de grado.
 * Maneja tanto creación de nuevos cursos como edición de existentes.
 *
 * @param props - Las propiedades del componente
 * @returns {JSX.Element | null} El modal o null si no está abierto
 *
 * @example
 * ```tsx
 * <CourseModal
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   onSave={handleSave}
 *   course={selectedCourse}
 *   teachers={teachersList}
 * />
 * ```
 */
const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, course, teachers }) => {
  const [courseName, setCourseName] = useState('');
  const [gradeDirectorId, setGradeDirectorId] = useState<number | undefined>();
  const [errors, setErrors] = useState<{ courseName?: string }>({});

  useEffect(() => {
    if (course) {
      setCourseName(course.courseName);
      setGradeDirectorId(course.gradeDirectorId);
    } else {
      setCourseName('');
      setGradeDirectorId(undefined);
    }
    setErrors({});
  }, [course, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { courseName?: string } = {};
    const trimmedName = courseName.trim();

    if (!trimmedName) {
      newErrors.courseName = 'El nombre del curso es obligatorio';
    } else if (trimmedName.length < 1) {
      newErrors.courseName = 'El nombre del curso debe tener al menos 1 caracter';
    } else if (trimmedName.length > 50) {
      newErrors.courseName = 'El nombre del curso debe tener máximo 50 caracteres';
    } else if (!/^[a-zA-ZÀ-ÿ0-9\s]+$/.test(trimmedName)) {
      newErrors.courseName = 'El nombre del curso solo puede contener letras, números y espacios';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        courseName: courseName.trim(),
        gradeDirectorId: gradeDirectorId || undefined,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg" aria-hidden="true">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                {course ? 'Editar Curso' : 'Agregar Curso'}
              </h2>
              <p id="modal-description" className="text-sm text-gray-600">
                {course ? 'Modifica la información del curso' : 'Ingresa la información del nuevo curso'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6 text-gray-500" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Nombre del curso */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Nombre del curso
            </label>
            <input
              type="text"
              id="course-name"
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                if (errors.courseName) setErrors({ ...errors, courseName: undefined });
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.courseName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingresa el nombre del curso"
              aria-describedby={errors.courseName ? "course-name-error" : undefined}
              aria-invalid={!!errors.courseName}
            />
            {errors.courseName && (
              <p id="course-name-error" className="text-red-500 text-sm" role="alert">
                {errors.courseName}
              </p>
            )}
          </div>

          {/* Director de grado */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 mr-2" />
              Director de grado
            </label>
            <select
              value={gradeDirectorId || ''}
              onChange={(e) => setGradeDirectorId(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Selecciona un director (opcional)</option>
              {teachers.map((teacher) => (
                <option key={teacher.teacherId} value={teacher.teacherId}>
                  {teacher.teacherName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            {course ? 'Actualizar' : 'Crear'} Curso
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;