"use client";

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Subject {
  subjectId: number;
  subjectName: string;
  profesoresAsociados?: number;
}

interface SubjectTableProps {
  subjects: Subject[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const SubjectTable = ({ subjects, onEdit, onDelete }: SubjectTableProps) => {
  const handleEdit = (id: number) => {
    onEdit(id);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  N. Profesores asociados
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Actos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.subjectId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subject.subjectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                      {subject.profesoresAsociados || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(subject.subjectId)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleDelete(subject.subjectId)}
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
        
        {subjects.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">No hay materias registradas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectTable;