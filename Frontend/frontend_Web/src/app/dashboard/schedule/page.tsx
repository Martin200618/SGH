"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import HeaderSchedule from "@/components/schedule/scheduleCourse/HeaderSchedule";
import ScheduleGenerateModal from "@/components/schedule/scheduleCourse/ScheduleGenerateModal";
import { getScheduleHistory, generateSchedule, ScheduleHistory } from "@/api/services/scheduleApi";

const exportSchedule = async (format: 'pdf' | 'excel' | 'image', type: 'course' | 'teacher' | 'all', id?: number) => {
  let url = `http://localhost:8085/schedules/${format}`;
  if (type === 'course' && id) {
    url += `/course/${id}`;
  } else if (type === 'teacher' && id) {
    url += `/teacher/${id}`;
  } else if (type === 'all') {
    url += '/all';
    if (format === 'pdf') url += '-teachers';
    else if (format === 'excel') url += '-teachers';
    else if (format === 'image') url += '-teachers';
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en la exportación');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `horario.${format === 'pdf' ? 'pdf' : format === 'excel' ? 'xlsx' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error exporting:', error);
    alert('Error al exportar');
  }
};

export default function SchedulePage() {
  const [history, setHistory] = useState<ScheduleHistory[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getScheduleHistory();
      setHistory(data.content);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const handleGenerateSchedule = () => {
    setIsGenerateModalOpen(true);
  };

  const handleConfirmGenerate = async (request: {
    periodStart: string;
    periodEnd: string;
    dryRun: boolean;
    force: boolean;
    params?: string;
  }) => {
    setLoading(true);
    try {
      await generateSchedule(request);
      await loadHistory(); // Refresh history
      setIsGenerateModalOpen(false);
    } catch (error) {
      console.error("Error generating schedule:", error);
      alert("Error al generar horario");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600 bg-green-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      case 'RUNNING': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderSchedule />

        <div className="my-6">
          <SearchBar />
        </div>

        {/* Historial de Generaciones */}
        <div className="my-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Historial de Generaciones</h2>
                <button
                  onClick={handleGenerateSchedule}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <span className="font-medium">Generar Nuevo Horario</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Ejecutado por
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Generados
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Mensaje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.executedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.executedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.totalGenerated}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {item.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {history.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 text-sm">No hay historial de generaciones</p>
              </div>
            )}
          </div>
        </div>

        {/* Reportes */}
        <div className="my-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Exportar Horarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">PDF</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => exportSchedule('pdf', 'all')}
                    className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Todos los Profesores
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Excel</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => exportSchedule('excel', 'all')}
                    className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Todos los Profesores
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Imagen</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => exportSchedule('image', 'all')}
                    className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Todos los Horarios
                  </button>
                  <button
                    onClick={() => exportSchedule('image', 'all', 0)}
                    className="w-full px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    Profesores
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ScheduleGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={handleCloseGenerateModal}
        onGenerate={handleConfirmGenerate}
      />
    </>
  );
}
