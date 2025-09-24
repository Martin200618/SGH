import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { getAllSubjects, Subject } from '../../api/services/subjectApi';

interface Teacher {
  teacherId: number;
  teacherName: string;
  subjectId: number;
  availabilitySummary?: string;
}

interface ProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Omit<Teacher, 'teacherId'>) => Promise<void>;
  teacher?: Teacher | null;
}

const ProfessorModal: React.FC<ProfessorModalProps> = ({ isOpen, onClose, onSave, teacher }) => {
  const [teacherName, setTeacherName] = useState('');
  const [subjectId, setSubjectId] = useState<number>(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSubjects();
      if (teacher) {
        setTeacherName(teacher.teacherName);
        setSubjectId(teacher.subjectId);
      } else {
        setTeacherName('');
        setSubjectId(0);
      }
    }
  }, [teacher, isOpen]);

  const loadSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const handleSave = async () => {
    const trimmedName = teacherName.trim();
    if (!trimmedName) {
      setError('El nombre completo del profesor es requerido');
      return;
    }
    if (trimmedName.length < 5) {
      setError('El nombre completo debe tener al menos 5 caracteres');
      return;
    }
    if (trimmedName.length > 50) {
      setError('El nombre completo debe tener máximo 50 caracteres');
      return;
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
      setError('El nombre completo solo puede contener letras y espacios');
      return;
    }
    if (subjectId <= 0) {
      setError('Debe seleccionar una materia');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await onSave({ teacherName: trimmedName, subjectId });
      onClose();
    } catch (error) {
      console.error('Error saving teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {teacher ? 'Editar Profesor' : 'Agregar Profesor'}
              </h2>
              <p className="text-sm text-gray-600">
                {teacher ? 'Modifica la información del profesor' : 'Ingresa la información del nuevo profesor'}
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
          {/* Nombre */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 mr-2" />
              Nombre completo del profesor
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => {
                setTeacherName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ingresa el nombre completo del profesor"
            />
          </div>

          {/* Materia */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              Materia asignada
            </label>
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(Number(e.target.value));
                if (error) setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value={0}>Selecciona una materia</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Guardando...' : (teacher ? 'Actualizar' : 'Crear')} Profesor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorModal;