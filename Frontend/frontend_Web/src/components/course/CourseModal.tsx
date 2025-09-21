import React, { useState, useEffect } from 'react';
import { X, BookOpen, User } from 'lucide-react';
import { Teacher } from '@/api/services/teacherApi';

interface Course {
  courseId: number;
  courseName: string;
  teacherSubjectId?: number;
  teacherId?: number;
  subjectId?: number;
  gradeDirectorId?: number;
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'courseId'>) => Promise<void>;
  course?: Course | null;
  teachers: Teacher[];
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, course, teachers }) => {
  const [courseName, setCourseName] = useState('');
  const [gradeDirectorId, setGradeDirectorId] = useState<number | undefined>();

  useEffect(() => {
    if (course) {
      setCourseName(course.courseName);
      setGradeDirectorId(course.gradeDirectorId);
    } else {
      setCourseName('');
      setGradeDirectorId(undefined);
    }
  }, [course, isOpen]);

  const handleSave = () => {
    if (courseName.trim()) {
      onSave({
        courseName: courseName.trim(),
        gradeDirectorId: gradeDirectorId || undefined,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {course ? 'Editar Curso' : 'Agregar Curso'}
              </h2>
              <p className="text-sm text-gray-600">
                {course ? 'Modifica la información del curso' : 'Ingresa la información del nuevo curso'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
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
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ingresa el nombre del curso"
            />
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