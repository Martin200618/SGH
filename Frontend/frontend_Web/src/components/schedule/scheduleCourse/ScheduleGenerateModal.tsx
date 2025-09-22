import React, { useState } from 'react';
import { X, Calendar, Play } from 'lucide-react';

interface ScheduleGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (request: {
    periodStart: string;
    periodEnd: string;
    dryRun: boolean;
    force: boolean;
    params?: string;
  }) => void;
}

const ScheduleGenerateModal: React.FC<ScheduleGenerateModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [dryRun, setDryRun] = useState(false);
  const [force, setForce] = useState(false);
  const [params, setParams] = useState('');

  const handleGenerate = () => {
    const request = {
      periodStart,
      periodEnd,
      dryRun,
      force,
      params: params || undefined,
    };
    onGenerate(request);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Generar Horario
              </h2>
              <p className="text-sm text-gray-600">
                Configura los parámetros para generar el horario
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
        <div className="p-6 space-y-6">
          {/* Periodo de inicio */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              Fecha de inicio del período
            </label>
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Periodo de fin */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              Fecha de fin del período
            </label>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Parámetros adicionales */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              Parámetros adicionales (opcional)
            </label>
            <input
              type="text"
              value={params}
              onChange={(e) => setParams(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Parámetros opcionales"
            />
          </div>

          {/* Opciones */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="dryRun"
                type="checkbox"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="dryRun" className="ml-2 text-sm text-gray-700">
                Simulación (dry run) - Solo calcular sin guardar
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="force"
                type="checkbox"
                checked={force}
                onChange={(e) => setForce(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="force" className="ml-2 text-sm text-gray-700">
                Forzar generación - Sobrescribir horarios existentes
              </label>
            </div>
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
            onClick={handleGenerate}
            className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            Generar Horario
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGenerateModal;