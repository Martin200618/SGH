"use client";   

import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const CoursesTable = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      nombre: 'A1',
      grado: 'Primero',
      directorCurso: 'Primero',
    },
    {
      id: 2,
      nombre: 'B1',
      grado: 'Primero',
      directorCurso: 'Primero',
    },
    {
      id: 3,
      nombre: 'A2',
      grado: 'Segundo',
      directorCurso: 'Segundo',
    },
    {
      id: 4,
      nombre: 'B2',
      grado: 'Segundo',
      directorCurso: 'Segundo',
    },
    {
      id: 5,
      nombre: 'A3',
      grado: 'Tercero',
      directorCurso: 'Tercero',
    }
  ]);

  const handleEdit = (id: number) => {
    console.log(`Editar curso con ID: ${id}`);
    // Aquí puedes agregar la lógica para editar
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const getGradeColor = (grado: string) => {
    switch(grado.toLowerCase()) {
      case 'primero':
        return 'text-green-600 bg-green-100';
      case 'segundo':
        return 'text-yellow-600 bg-yellow-100';
      case 'tercero':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-blue-600 bg-blue-100';
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
                  Actos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{course.nombre}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getGradeColor(course.grado)}`}>
                      {course.grado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {course.directorCurso}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(course.id)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleDelete(course.id)}
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
        
        {courses.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">No hay cursos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesTable;