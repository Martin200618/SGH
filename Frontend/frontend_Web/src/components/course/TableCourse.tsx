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

const gradeMap: { [key: string]: string } = {
  '1': 'Primero',
  '2': 'Segundo',
  '3': 'Tercero',
  '4': 'Cuarto',
  '5': 'Quinto',
  '6': 'Sexto',
  '7': 'Séptimo',
  '8': 'Octavo',
  '9': 'Noveno',
  '10': 'Décimo',
  '11': 'Undécimo',
};

const convertCourseName = (name: string): string => {
  if (name.includes('-')) {
    const parts = name.split('-');
    const names = parts.map(part => {
      const num = part.match(/\d+/)?.[0];
      return num ? gradeMap[num] || 'Otro' : 'Otro';
    });
    if (names.length === 1) return names[0];
    if (names.length === 2) return names.join(' y ');
    const last = names.pop();
    return names.join('-') + ' y ' + last;
  } else {
    const num = name.match(/\d+/)?.[0];
    return num ? gradeMap[num] || 'Otro' : 'Otro';
  }
};

const TableCourse = ({ courses, onEdit, onDelete }: TableCourseProps) => {
  const handleEdit = (id: number) => {
    onEdit(id);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
  };

  const sortedCourses = [...courses].sort((a, b) => {
    const matchA = a.courseName.match(/^([A-Za-z]+)(\d+)/);
    const matchB = b.courseName.match(/^([A-Za-z]+)(\d+)/);
    const prefixA = matchA ? matchA[1] : '';
    const prefixB = matchB ? matchB[1] : '';
    const numA = matchA ? parseInt(matchA[2]) : 0;
    const numB = matchB ? parseInt(matchB[2]) : 0;

    if (prefixA < prefixB) return -1;
    if (prefixA > prefixB) return 1;
    return numA - numB;
  });

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
              {sortedCourses.map((course) => {
                const gradeNumber = course.courseName.match(/\d+/)?.[0];
                const gradeName = convertCourseName(course.courseName);
                const gradeColor = gradeNumber === '1' ? 'text-green-600 bg-green-100' :
                  gradeNumber === '2' ? 'text-yellow-600 bg-yellow-100' :
                  gradeNumber === '3' ? 'text-purple-600 bg-purple-100' :
                  gradeNumber === '4' ? 'text-red-600 bg-red-100' :
                  gradeNumber === '5' ? 'text-indigo-600 bg-indigo-100' :
                  gradeNumber === '6' ? 'text-pink-600 bg-pink-100' :
                  gradeNumber === '7' ? 'text-teal-600 bg-teal-100' :
                  gradeNumber === '8' ? 'text-orange-600 bg-orange-100' :
                  gradeNumber === '9' ? 'text-cyan-600 bg-cyan-100' :
                  gradeNumber === '10' ? 'text-lime-600 bg-lime-100' :
                  gradeNumber === '11' ? 'text-amber-600 bg-amber-100' :
                  'text-blue-600 bg-blue-100';

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

        {sortedCourses.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">No hay cursos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableCourse;