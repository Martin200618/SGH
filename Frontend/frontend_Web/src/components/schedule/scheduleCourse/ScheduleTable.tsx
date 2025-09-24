import React from 'react';
import { Schedule } from '@/api/services/scheduleApi';
import { Course } from '@/api/services/courseApi';

interface ScheduleTableProps {
  schedulesByCourse: Record<number, Schedule[]>;
  courses: Course[];
  onEdit: (courseId: number) => void;
  onGenerate: () => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedulesByCourse,
  courses,
  onEdit,
  onGenerate,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Horarios de Cursos</h2>
        <button
          onClick={onGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Generar Horario
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Número de Horarios
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => {
              const courseSchedules = schedulesByCourse[course.courseId] || [];
              return (
                <tr key={course.courseId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.courseName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {courseSchedules.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => onEdit(course.courseId)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;