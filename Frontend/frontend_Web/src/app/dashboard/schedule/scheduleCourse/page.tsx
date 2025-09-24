"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import HeaderSchedule from "@/components/schedule/scheduleCourse/HeaderSchedule";
import ScheduleModal from "@/components/schedule/scheduleCourse/ScheduleModal";
import ScheduleGenerateModal from "@/components/schedule/scheduleCourse/ScheduleGenerateModal";
import { getAllSchedules, Schedule } from "@/api/services/scheduleApi";
import { getAllCourses, Course } from "@/api/services/courseApi";

const exportSchedule = async (format: 'pdf' | 'excel' | 'image', type: 'course' | 'teacher' | 'all', id?: number) => {
  let url = `http://localhost:8085/schedules/${format}`;
  if (type === 'course' && id) {
    url += `/course/${id}`;
  } else if (type === 'teacher' && id) {
    url += `/teacher/${id}`;
  } else if (type === 'all') {
    url += '/all';
    if (format === 'pdf') url += '-teachers';
    else if (format === 'excel') url += '-teachers';
    else if (format === 'image') url += '-teachers';
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en la exportación');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `horario.${format === 'pdf' ? 'pdf' : format === 'excel' ? 'xlsx' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error exporting:', error);
    alert('Error al exportar');
  }
};

const generateTimes = (schedules: Schedule[]) => {
  const timeSet = new Set<string>();
  schedules.forEach(schedule => {
    timeSet.add(schedule.startTime);
  });
  const sortedTimes = Array.from(timeSet).sort();
  const times: string[] = [];
  sortedTimes.forEach(startTime => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    times.push(`${formatTime(startTime)} - ${formatTime(endTime)}`);
  });
  return times;
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const getScheduleForTimeAndDay = (schedules: Schedule[], time: string, day: string) => {
  const [startTimeStr] = time.split(' - ');
  const [h, m, p] = startTimeStr.split(/[: ]/);
  const hours = p === 'PM' && h !== '12' ? parseInt(h) + 12 : p === 'AM' && h === '12' ? 0 : parseInt(h);
  const scheduleTime = `${hours.toString().padStart(2, '0')}:${m}`;

  return schedules.find(s => s.startTime.startsWith(scheduleTime) && s.day === day);
};

const renderScheduleTable = (schedules: Schedule[], courseName: string, key: string) => {
  const times = generateTimes(schedules);
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{courseName}</h3>
      </div>
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
                  const isLunch = time.includes("12:00 PM");
                  const content = isLunch ? "Almuerzo" : schedule ? `${schedule.teacherName || 'Profesor'}/${schedule.subjectName || 'Materia'}` : "";

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
  );
};

export default function ScheduleCoursePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesData, coursesData] = await Promise.all([
          getAllSchedules(),
          getAllCourses()
        ]);
        setSchedules(schedulesData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Agrupar schedules por courseId
  const schedulesByCourse = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.courseId]) {
      acc[schedule.courseId] = [];
    }
    acc[schedule.courseId].push(schedule);
    return acc;
  }, {} as Record<number, Schedule[]>);

  const handleEditSchedule = (courseId: number) => {
    const course = courses.find(c => c.courseId === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsModalOpen(true);
    }
  };

  const handleGenerateSchedule = () => {
    setIsGenerateModalOpen(true);
  };

  const handleConfirmGenerate = () => {
    alert('Generar horario - Funcionalidad requiere implementación en backend');
    setIsGenerateModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderSchedule/>

        <div className="my-6">
          <SearchBar/>
        </div>
        {/* Tabla de Horarios */}
        <div className="my-6">
          {courses.map((course) => {
            const courseSchedules = schedulesByCourse[course.courseId] || [];
            return courseSchedules.length > 0 ? (
              renderScheduleTable(courseSchedules, course.courseName, course.courseId.toString())
            ) : (
              <div key={course.courseId} className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800">{course.courseName}</h3>
                <p className="text-gray-500">No hay horarios asignados para este curso.</p>
              </div>
            );
          })}
        </div>

        {/* Reportes */}
        <div className="my-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Exportar Horarios de Cursos</h2>
            {courses.map((course) => {
              const courseSchedules = schedulesByCourse[course.courseId] || [];
              if (courseSchedules.length === 0) return null;

              return (
                <div key={course.courseId} className="mb-4 p-4 border border-gray-200 rounded">
                  <h3 className="text-md font-medium mb-2">{course.courseName}</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => exportSchedule('pdf', 'course', course.courseId)}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => exportSchedule('excel', 'course', course.courseId)}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Excel
                    </button>
                    <button
                      onClick={() => exportSchedule('image', 'course', course.courseId)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Imagen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRegenerate={handleGenerateSchedule}
        courseName={selectedCourse?.courseName || ''}
      />

      <ScheduleGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={handleCloseGenerateModal}
        onGenerate={handleConfirmGenerate}
      />
    </>
  );
}
