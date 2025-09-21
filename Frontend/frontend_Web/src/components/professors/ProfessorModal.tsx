import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, Calendar } from 'lucide-react';

interface Professor {
  id: number;
  nombre: string;
  especializacion: string;
  disponibilidad: string[];
}

interface ProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (professor: Omit<Professor, 'id'>) => void;
  professor?: Professor | null;
}

const ProfessorModal: React.FC<ProfessorModalProps> = ({ isOpen, onClose, onSave, professor }) => {
  const [nombre, setNombre] = useState('');
  const [especializacion, setEspecializacion] = useState('');
  const [disponibilidad, setDisponibilidad] = useState<string[]>([]);
  const [newDisponibilidad, setNewDisponibilidad] = useState('');

  useEffect(() => {
    if (professor) {
      setNombre(professor.nombre);
      setEspecializacion(professor.especializacion);
      setDisponibilidad(professor.disponibilidad);
    } else {
      setNombre('');
      setEspecializacion('');
      setDisponibilidad([]);
    }
  }, [professor, isOpen]);

  const handleAddDisponibilidad = () => {
    if (newDisponibilidad.trim() && !disponibilidad.includes(newDisponibilidad.trim())) {
      setDisponibilidad([...disponibilidad, newDisponibilidad.trim()]);
      setNewDisponibilidad('');
    }
  };

  const handleRemoveDisponibilidad = (item: string) => {
    setDisponibilidad(disponibilidad.filter(d => d !== item));
  };

  const handleSave = () => {
    if (nombre.trim() && especializacion.trim()) {
      onSave({ nombre: nombre.trim(), especializacion: especializacion.trim(), disponibilidad });
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
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {professor ? 'Editar Profesor' : 'Agregar Profesor'}
              </h2>
              <p className="text-sm text-gray-600">
                {professor ? 'Modifica la información del profesor' : 'Ingresa los datos del nuevo profesor'}
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
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ingresa el nombre del profesor"
            />
          </div>

          {/* Especialización */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Especialización
            </label>
            <input
              type="text"
              value={especializacion}
              onChange={(e) => setEspecializacion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ej: Matemáticas, Física, etc."
            />
          </div>

          {/* Disponibilidad */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              Disponibilidad
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newDisponibilidad}
                onChange={(e) => setNewDisponibilidad(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Agregar materia o día"
                onKeyPress={(e) => e.key === 'Enter' && handleAddDisponibilidad()}
              />
              <button
                onClick={handleAddDisponibilidad}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Agregar
              </button>
            </div>

            {/* Tags de disponibilidad */}
            {disponibilidad.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl">
                {disponibilidad.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
                  >
                    {item}
                    <button
                      onClick={() => handleRemoveDisponibilidad(item)}
                      className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
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
            {professor ? 'Actualizar' : 'Crear'} Profesor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorModal;