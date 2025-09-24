import React, { useState, useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';

interface Subject {
  subjectId: number;
  subjectName: string;
}

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: Omit<Subject, 'subjectId'>) => Promise<void>;
  subject?: Subject | null;
}

const SubjectModal: React.FC<SubjectModalProps> = ({ isOpen, onClose, onSave, subject }) => {
  const [subjectName, setSubjectName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (subject) {
      setSubjectName(subject.subjectName);
    } else {
      setSubjectName('');
    }
  }, [subject, isOpen]);

  const handleSave = () => {
    const trimmedName = subjectName.trim();
    if (!trimmedName) {
      setError('El nombre de la materia es requerido');
      return;
    }
    if (trimmedName.length < 5) {
      setError('El nombre debe tener al menos 5 caracteres');
      return;
    }
    if (trimmedName.length > 20) {
      setError('El nombre debe tener máximo 20 caracteres');
      return;
    }
    if (/\d/.test(trimmedName)) {
      setError('El nombre no puede contener números');
      return;
    }
    setError('');
    onSave({ subjectName: trimmedName });
    onClose();
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
                {subject ? 'Editar Materia' : 'Agregar Materia'}
              </h2>
              <p className="text-sm text-gray-600">
                {subject ? 'Modifica el nombre de la materia' : 'Ingresa el nombre de la nueva materia'}
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
              <BookOpen className="w-4 h-4 mr-2" />
              Nombre de la materia
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ingresa el nombre de la materia"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
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
            {subject ? 'Actualizar' : 'Crear'} Materia
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;