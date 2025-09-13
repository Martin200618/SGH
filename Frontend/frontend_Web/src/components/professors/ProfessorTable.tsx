import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ProfessorTable = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      nombre: 'Sofia',
      especializacion: 'Matematicas',
      materias: ['Matematicas', 'Ciencias Naturales']
    },
    {
      id: 2,
      nombre: 'Valentina',
      especializacion: 'Fisica',
      materias: ['Fisica', 'Quimica']
    },
    {
      id: 3,
      nombre: 'Carol',
      especializacion: 'Quimica',
      materias: ['Quimica', 'Algebra']
    },
    {
      id: 4,
      nombre: 'Sara',
      especializacion: 'Biologia',
      materias: ['Biologia', 'Español']
    },
    {
      id: 5,
      nombre: 'Maria',
      especializacion: 'Ingles',
      materias: ['Ingles', 'Sociales']
    }
  ]);

  const handleEdit = (id: number) => {
    console.log(`Editar profesor con ID: ${id}`);
    // Aquí puedes agregar la lógica para editar
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      setTeachers(teachers.filter(teacher => teacher.id !== id));
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
                  Especialización
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Materias
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Actos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {teacher.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-blue-600 font-medium">
                      {teacher.especializacion}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.materias.map((materia, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full"
                        >
                          {materia}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(teacher.id)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleDelete(teacher.id)}
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