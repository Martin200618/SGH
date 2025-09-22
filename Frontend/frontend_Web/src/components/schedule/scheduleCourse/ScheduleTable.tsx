import React from 'react';

interface Schedule {
  id: number;
  courseId: number;
  teacherId?: number;
  subjectId?: number;
  day: string;
  startTime: string;
  endTime: string;
  scheduleName: string;
  teacherName?: string;
  subjectName?: string;
}

interface Course {
  courseId: number;
  courseName: string;
}

interface ScheduleTableProps {
  schedulesByCourse: Record<number, Schedule[]>;
  courses: Course[];
  onEdit: (courseId: number) => void;
  onGenerate: () => void;
}

const ScheduleTable = ({ schedulesByCourse, courses, onEdit, onGenerate }: ScheduleTableProps) => {
  const times = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM"
  ];

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const dayMap: Record<string, string> = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes'
  };

  const getScheduleForTimeAndDay = (schedules: Schedule[], time: string, day: string) => {
    const [startTime] = time.split(' - ');
    // Convertir startTime a formato HH:mm
    const timeMap: Record<string, string> = {
      "8:00 AM": "08:00",
      "9:00 AM": "09:00",
      "10:00 AM": "10:00",
      "11:00 AM": "11:00",
      "12:00 PM": "12:00",
      "1:00 PM": "13:00",
      "2:00 PM": "14:00",
      "3:00 PM": "15:00"
    };

    const scheduleTime = timeMap[startTime];
    if (!scheduleTime) return null;

    return schedules.find(s => s.startTime.startsWith(scheduleTime) && dayMap[s.day] === day);
  };

  const renderScheduleTable = (courseId: number) => {
    const course = courses.find(c => c.courseId === courseId);
    const courseName = course?.courseName || `Curso ${courseId}`;
    const schedules = schedulesByCourse[courseId] || [];

    return (
      <div key={courseId} className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Curso {courseName}</h2>

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
                {times.map((time, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {time}
                    </td>
                    {days.map((day) => {
                      const schedule = getScheduleForTimeAndDay(schedules, time, day);
                      const isLunch = time === "12:00 PM - 1:00 PM";
                      const content = isLunch ? "Almuerzo" : schedule ? `${schedule.subjectName || 'Materia'}/${schedule.teacherName || 'Profesor'}` : "";

                      return (
                        <td
                          key={day}
                          className={`px-6 py-4 text-center text-sm ${
                            isLunch
                              ? 'bg-orange-100 text-orange-800 font-medium'
                              : content
                                ? 'text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors'
                                : 'text-gray-400'
                          }`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Horarios de Clase</h1>

        {/* Botón Generar nuevo horario */}
        <div className="mb-6">
          <button
            onClick={onGenerate}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-300"
          >
            <div className="w-5 h-5 border-2 border-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold text-lg leading-none">+</span>
            </div>
            <span className="font-medium">Generar nuevo horario</span>
          </button>
        </div>

        {Object.keys(schedulesByCourse).map(courseIdStr => renderScheduleTable(parseInt(courseIdStr)))}
      </div>
    </div>
  );
};

export default ScheduleTable;