import React from "react";
import { Edit } from "lucide-react";

const ScheduleTable = () => {
  const scheduleData = [
    {
      time: "8:00 AM - 9:00 AM",
      lunes: "Matemáticas",
      martes: "Historia",
      miercoles: "Química",
      jueves: "Literatura",
      viernes: "Física",
    },
    {
      time: "9:00 AM - 10:00 AM",
      lunes: "Historia",
      martes: "Matemáticas",
      miercoles: "Inglés",
      jueves: "Biología",
      viernes: "Arte",
    },
    {
      time: "10:00 AM - 11:00 AM",
      lunes: "Inglés",
      martes: "Física",
      miercoles: "Matemáticas",
      jueves: "Educación Física",
      viernes: "Música",
    },
    {
      time: "11:00 AM - 12:00 PM",
      lunes: "Química",
      martes: "Literatura",
      miercoles: "Historia",
      jueves: "Inglés",
      viernes: "Geografía",
    },
    {
      time: "12:00 PM - 1:00 PM",
      lunes: "Almuerzo",
      martes: "Almuerzo",
      miercoles: "Almuerzo",
      jueves: "Almuerzo",
      viernes: "Almuerzo",
    },
    {
      time: "1:00 PM - 2:00 PM",
      lunes: "Biología",
      martes: "Arte",
      miercoles: "Educación Física",
      jueves: "Química",
      viernes: "Literatura",
    },
    {
      time: "2:00 PM - 3:00 PM",
      lunes: "Educación Física",
      martes: "Música",
      miercoles: "Geografía",
      jueves: "Arte",
      viernes: "Historia",
    },
    {
      time: "3:00 PM - 4:00 PM",
      lunes: "Arte",
      martes: "Geografía",
      miercoles: "Literatura",
      jueves: "Música",
      viernes: "Inglés",
    },
  ];

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const renderSubject = (
    subject:
      | string
      | number
      | bigint
      | boolean
      | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | Promise<
          | string
          | number
          | bigint
          | boolean
          | React.ReactPortal
          | React.ReactElement<
              unknown,
              string | React.JSXElementConstructor<any>
            >
          | Iterable<React.ReactNode>
          | null
          | undefined
        >
      | null
      | undefined
  ) => {
    if (subject === "Almuerzo") {
      return (
        <span className="inline-block px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
          {subject}
        </span>
      );
    }

    return (
      <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
        {subject}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header con información del curso */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Horario Académico
              </h1>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Curso:</span> 1A
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Horario:</span> 8:00 AM - 4:00
                  PM
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Periodo:</span> Lunes a Viernes
                </div>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              Editar Horario
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Tiempo
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduleData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderSubject(row.lunes)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderSubject(row.martes)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderSubject(row.miercoles)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderSubject(row.jueves)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderSubject(row.viernes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {scheduleData.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">No hay horarios registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTable;
