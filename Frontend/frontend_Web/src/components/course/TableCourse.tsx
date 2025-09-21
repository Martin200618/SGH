"use client";

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Course {
  courseId: number;
  courseName: string;
  gradeDirectorId?: number;
  directorName?: string;
}

interface TableCourseProps {
  courses: Course[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TableCourse = ({ courses, onEdit, onDelete }: TableCourseProps) => {
  const handleEdit = (id: number) => {
    onEdit(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
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
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Grado
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Director de curso
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => {
                const gradeNumber = course.courseName.match(/\d+/)?.[0];
                const gradeName = gradeNumber === '1' ? 'Primero' : gradeNumber === '2' ? 'Segundo' : gradeNumber === '3' ? 'Tercero' : 'Otro';
                const gradeColor = gradeNumber === '1' ? 'text-green-600 bg-green-100' : gradeNumber === '2' ? 'text-yellow-600 bg-yellow-100' : gradeNumber === '3' ? 'text-purple-600 bg-purple-100' : 'text-blue-600 bg-blue-100';

                return (
                  <tr key={course.courseId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">{course.courseName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${gradeColor}`}>
                        {gradeName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {course.directorName || 'Sin asignar'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(course.courseId)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(course.courseId)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {courses.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">No hay cursos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableCourse;