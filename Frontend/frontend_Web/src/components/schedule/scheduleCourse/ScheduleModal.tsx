import React from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: () => void;
  courseName: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onRegenerate,
  courseName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Horario de {courseName}</h2>
        <p className="mb-4">Aquí se mostraría el horario detallado del curso.</p>
        <div className="flex space-x-4">
          <button
            onClick={onRegenerate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Regenerar Horario
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;