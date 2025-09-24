"use client";

import React from 'react';
import { Edit, Trash2, Clock } from 'lucide-react';

interface Teacher {
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName?: string;
  availabilityDays?: string;
}

interface ProfessorTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: number) => void;
  onManageAvailability: (teacher: Teacher) => void;
}

const ProfessorTable = ({ teachers, onEdit, onDelete, onManageAvailability }: ProfessorTableProps) => {
  const handleEdit = (teacher: Teacher) => {
    onEdit(teacher);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      onDelete(id);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Nombre completo
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Materia
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Disponibilidad
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.teacherId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{teacher.teacherName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {teacher.subjectName || 'Sin asignar'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {teacher.availabilityDays || 'No configurada'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => onManageAvailability(teacher)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded hover:bg-green-200 transition-colors"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Disponibilidad
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.teacherId)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {teachers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">No hay profesores registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorTable;