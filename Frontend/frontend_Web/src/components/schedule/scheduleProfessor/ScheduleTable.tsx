import React from 'react';

interface ProfessorScheduleRow {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

interface ProfessorScheduleData {
  [key: string]: ProfessorScheduleRow[];
}

const ProfessorScheduleTable = () => {
  const professorSchedules: ProfessorScheduleData = {
    "Carol": [
      { time: "8:00 AM - 9:00 AM", monday: "", tuesday: "", wednesday: "Curso", thursday: "", friday: "Curso" },
      { time: "9:00 AM - 10:00 AM", monday: "Curso", tuesday: "", wednesday: "", thursday: "Curso", friday: "Curso" },
      { time: "10:00 AM - 11:00 AM", monday: "Curso", tuesday: "Curso", wednesday: "Curso", thursday: "", friday: "Curso" },
      { time: "11:00 AM - 12:00 PM", monday: "Curso", tuesday: "", wednesday: "Curso", thursday: "Curso", friday: "Curso" },
      { time: "12:00 PM - 1:00 PM", monday: "Almuerzo", tuesday: "Almuerzo", wednesday: "Almuerzo", thursday: "Almuerzo", friday: "Almuerzo" },
      { time: "1:00 PM - 2:00 PM", monday: "", tuesday: "", wednesday: "", thursday: "Curso", friday: "Curso" },
      { time: "2:00 PM - 3:00 PM", monday: "", tuesday: "Curso", wednesday: "Curso", thursday: "", friday: "Curso" },
      { time: "3:00 PM - 4:00 PM", monday: "", tuesday: "Curso", wednesday: "", thursday: "", friday: "Curso" }
    ],
    "Valentina": [
      { time: "8:00 AM - 9:00 AM", monday: "Curso", tuesday: "", wednesday: "Curso", thursday: "", friday: "Curso" },
      { time: "9:00 AM - 10:00 AM", monday: "Curso", tuesday: "Curso", wednesday: "Curso", thursday: "", friday: "Curso" },
      { time: "10:00 AM - 11:00 AM", monday: "Curso", tuesday: "Curso", wednesday: "Curso", thursday: "", friday: "Curso" },
      { time: "11:00 AM - 12:00 PM", monday: "Curso", tuesday: "", wednesday: "Curso", thursday: "Curso", friday: "Curso" },
      { time: "12:00 PM - 1:00 PM", monday: "Almuerzo", tuesday: "Almuerzo", wednesday: "Almuerzo", thursday: "Almuerzo", friday: "Almuerzo" },
      { time: "1:00 PM - 2:00 PM", monday: "Curso", tuesday: "", wednesday: "", thursday: "Curso", friday: "Curso" },
      { time: "2:00 PM - 3:00 PM", monday: "Curso", tuesday: "Curso", wednesday: "", thursday: "Curso", friday: "Curso" },
      { time: "3:00 PM - 4:00 PM", monday: "Curso", tuesday: "Curso", wednesday: "", thursday: "Curso", friday: "Curso" }
    ]
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const dayKeys: (keyof Omit<ProfessorScheduleRow, 'time'>)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  const renderProfessorScheduleTable = (professorName: string) => (
    <div key={professorName} className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{professorName}</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider min-w-32">
                  Tiempo
                </th>
                {days.map((day) => (
                  <th key={day} className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider min-w-36">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {professorSchedules[professorName]?.map((row: ProfessorScheduleRow, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {row.time}
                  </td>
                  {dayKeys.map((dayKey) => (
                    <td 
                      key={dayKey} 
                      className={`px-6 py-4 text-center text-sm ${
                        row[dayKey] === 'Almuerzo' 
                          ? 'bg-orange-100 text-orange-800 font-medium' 
                          : row[dayKey] === 'Curso'
                          ? 'text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors'
                          : 'text-gray-300'
                      }`}
                    >
                      {row[dayKey]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors">
          Editar
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-5 h-5 border-2 border-gray-600 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-lg leading-none">+</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Generar nuevo horario</h1>
        </div>
        
        {Object.keys(professorSchedules).map(professorName => renderProfessorScheduleTable(professorName))}
      </div>
    </div>
  );
};

export default ProfessorScheduleTable;