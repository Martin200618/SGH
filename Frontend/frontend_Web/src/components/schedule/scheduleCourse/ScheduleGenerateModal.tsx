import React from 'react';

interface ScheduleGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
}

const ScheduleGenerateModal: React.FC<ScheduleGenerateModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Generar Horario</h2>
        <p className="mb-4">¿Desea generar un nuevo horario automáticamente?</p>
        <div className="flex space-x-4">
          <button
            onClick={onGenerate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Generar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGenerateModal;