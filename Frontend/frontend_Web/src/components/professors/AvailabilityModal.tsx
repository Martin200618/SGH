import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { getTeacherAvailability, registerAvailability, updateAvailability, TeacherAvailability, TeacherAvailabilityDTO } from '../../api/services/teacherApi';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: number;
  teacherName: string;
  onAvailabilityUpdated?: (teacherId: number, availabilityDays: string) => void;
}

const DAYS_OF_WEEK = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
];

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ isOpen, onClose, teacherId, teacherName, onAvailabilityUpdated }) => {
  const [availabilities, setAvailabilities] = useState<TeacherAvailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const [amStart, setAmStart] = useState<string>('');
  const [amEnd, setAmEnd] = useState<string>('');
  const [pmStart, setPmStart] = useState<string>('');
  const [pmEnd, setPmEnd] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && teacherId) {
      loadAvailability();
    }
  }, [isOpen, teacherId]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const data = await getTeacherAvailability(teacherId);
      setAvailabilities(data);
    } catch (error: any) {
      console.error('Error loading availability:', error);
      setError('Error al cargar la disponibilidad');
      setAvailabilities([]); // Fallback a array vacío
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDayAvailability = () => {
    return availabilities.find(a => a.day === selectedDay);
  };

  const handleSave = async () => {
    if (!amStart && !amEnd && !pmStart && !pmEnd) {
      setError('Debe proporcionar al menos un horario válido');
      return;
    }

    if ((amStart && !amEnd) || (!amStart && amEnd)) {
      setError('Si configura horario de mañana, debe completar inicio y fin');
      return;
    }

    if ((pmStart && !pmEnd) || (!pmStart && pmEnd)) {
      setError('Si configura horario de tarde, debe completar inicio y fin');
      return;
    }

    const availabilityData: TeacherAvailabilityDTO = {
      teacherId,
      day: selectedDay as any,
      amStart: amStart || null,
      amEnd: amEnd || null,
      pmStart: pmStart || null,
      pmEnd: pmEnd || null,
    };

    try {
      setLoading(true);
      setError('');

      const existing = getCurrentDayAvailability();
      if (existing) {
        await updateAvailability(availabilityData);
      } else {
        await registerAvailability(availabilityData);
      }

      // Recargar disponibilidad para obtener los días actualizados
      const updatedAvailability = await getTeacherAvailability(teacherId);
      const availabilityDays = updatedAvailability.length > 0
        ? updatedAvailability.map(a => a.day).join(', ')
        : 'No configurada';

      // Notificar al componente padre sobre la actualización
      if (onAvailabilityUpdated) {
        onAvailabilityUpdated(teacherId, availabilityDays);
      }

      await loadAvailability(); // Recargar datos para el modal
      setError('');
    } catch (error: any) {
      console.error('Error saving availability:', error);
      setError(error.message || 'Error al guardar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    const dayAvailability = availabilities.find(a => a.day === day);
    if (dayAvailability) {
      setAmStart(dayAvailability.amStart || '');
      setAmEnd(dayAvailability.amEnd || '');
      setPmStart(dayAvailability.pmStart || '');
      setPmEnd(dayAvailability.pmEnd || '');
    } else {
      setAmStart('');
      setAmEnd('');
      setPmStart('');
      setPmEnd('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Disponibilidad de {teacherName}
              </h2>
              <p className="text-sm text-gray-600">
                Configura los horarios disponibles por día
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

        {/* Content */}
        <div className="p-6">
          {/* Day Selector */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="w-4 h-4 mr-2" />
              Día de la semana
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  onClick={() => handleDayChange(day.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDay === day.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Inputs */}
          <div className="space-y-6">
            {/* Morning Schedule */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Horario de Mañana
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inicio
                  </label>
                  <input
                    type="time"
                    value={amStart}
                    onChange={(e) => setAmStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fin
                  </label>
                  <input
                    type="time"
                    value={amEnd}
                    onChange={(e) => setAmEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Afternoon Schedule */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Horario de Tarde
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inicio
                  </label>
                  <input
                    type="time"
                    value={pmStart}
                    onChange={(e) => setPmStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fin
                  </label>
                  <input
                    type="time"
                    value={pmEnd}
                    onChange={(e) => setPmEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Current Availability Display */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Disponibilidad actual para {DAYS_OF_WEEK.find(d => d.value === selectedDay)?.label}:</h4>
            {getCurrentDayAvailability() ? (
              <div className="text-sm text-gray-600">
                {getCurrentDayAvailability()?.amStart && getCurrentDayAvailability()?.amEnd && (
                  <p>Mañana: {getCurrentDayAvailability()?.amStart} - {getCurrentDayAvailability()?.amEnd}</p>
                )}
                {getCurrentDayAvailability()?.pmStart && getCurrentDayAvailability()?.pmEnd && (
                  <p>Tarde: {getCurrentDayAvailability()?.pmStart} - {getCurrentDayAvailability()?.pmEnd}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No configurada</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cerrar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Disponibilidad'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;