import React from 'react';
import { X, RefreshCw, Trash2 } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: () => void;
  onDelete: () => void;
  courseName: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onRegenerate, onDelete, courseName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Gestionar Horario
              </h2>
              <p className="text-sm text-gray-600">
                Curso: {courseName}
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

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            ¿Qué acción deseas realizar con el horario de este curso?
          </p>

          <div className="space-y-3">
            <button
              onClick={onRegenerate}
              className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-900">Regenerar Horario</div>
                <div className="text-sm text-blue-700">Crear un nuevo horario automáticamente</div>
              </div>
            </button>

            <button
              onClick={onDelete}
              className="w-full flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <div className="font-medium text-red-900">Eliminar Horario</div>
                <div className="text-sm text-red-700">Remover el horario actual del curso</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;