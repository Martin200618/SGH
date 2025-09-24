"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/dashboard/SearchBar";
import HeaderSchedule from "@/components/schedule/scheduleCourse/HeaderSchedule";
import { getScheduleHistory, generateSchedule, ScheduleHistory, Schedule, createSchedule, getSchedulesByCourse } from "@/api/services/scheduleApi";
import { getAllCourses, Course } from "@/api/services/courseApi";
import { getAllSubjects, Subject } from "@/api/services/subjectApi";
import { getAllTeachers, Teacher } from "@/api/services/teacherApi";

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

export default function SchedulePage() {
  const router = useRouter();
  const [history, setHistory] = useState<ScheduleHistory[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para formulario manual
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<number | ''>('');
  const [selectedTeacher, setSelectedTeacher] = useState<number | ''>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [scheduleEntries, setScheduleEntries] = useState<Schedule[]>([]);
  const [courseSchedules, setCourseSchedules] = useState<Schedule[]>([]);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, subjectsData, teachersData] = await Promise.all([
          getAllCourses(),
          getAllSubjects(),
          getAllTeachers()
        ]);
        setCourses(coursesData);
        setSubjects(subjectsData);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getScheduleHistory();
      setHistory(data.content);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const loadCourseSchedules = async (courseId: number) => {
    try {
      const data = await getSchedulesByCourse(courseId);
      setCourseSchedules(data);
    } catch (error) {
      console.error("Error loading course schedules:", error);
    }
  };

  const handleGenerateSchedule = () => {
    setIsGenerateModalOpen(true);
  };

  const handleConfirmGenerate = async (request: {
    periodStart: string;
    periodEnd: string;
    dryRun: boolean;
    force: boolean;
    params?: string;
  }) => {
    setLoading(true);
    try {
      await generateSchedule(request);
      await loadHistory(); // Refresh history
      setIsGenerateModalOpen(false);
    } catch (error) {
      console.error("Error generating schedule:", error);
      alert("Error al generar horario");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  const clearForm = () => {
    setSelectedCourse('');
    setSelectedDay('');
    setSelectedSubject('');
    setSelectedTeacher('');
    setStartTime('');
    setEndTime('');
  };

  const addToSchedule = async () => {
    if (!selectedCourse || !selectedDay || !selectedSubject || !selectedTeacher || !startTime || !endTime) {
      alert('Por favor complete todos los campos');
      return;
    }
    const course = courses.find(c => c.courseId === selectedCourse);
    const subject = subjects.find(s => s.subjectId === selectedSubject);
    const teacher = teachers.find(t => t.teacherId === selectedTeacher);
    if (!course || !subject || !teacher) return;

    const newEntry: Omit<Schedule, 'id'> = {
      courseId: selectedCourse,
      teacherId: selectedTeacher,
      subjectId: selectedSubject,
      day: selectedDay,
      startTime,
      endTime,
      scheduleName: `${course.courseName} - ${subject.subjectName}`,
      teacherName: teacher.teacherName,
      subjectName: subject.subjectName,
    };

    try {
      await createSchedule(newEntry);
      await loadCourseSchedules(selectedCourse);
      clearForm();
    } catch (error) {
      console.error("Error creating schedule:", error);
      alert("Error al crear el horario");
    }
  };

  const filteredTeachers = teachers.filter(t => selectedSubject && t.subjectId === selectedSubject);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600 bg-green-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      case 'RUNNING': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const renderScheduleTable = (schedules: Schedule[]) => {
    const times = generateTimes(schedules);
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    return (
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

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderSchedule />

        <div className="my-6">
          <SearchBar />
        </div>

        {/* Ver Horario de Curso */}
        <div className="my-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Ver Horario de Curso</h2>
            <div className="flex space-x-4">
              <select
                value={selectedCourse || ''}
                onChange={(e) => {
                  const courseId = Number(e.target.value) || '';
                  setSelectedCourse(courseId);
                  if (courseId) loadCourseSchedules(courseId);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar Curso</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reportes */}
        <div className="my-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Exportar Horarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">PDF</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => exportSchedule('pdf', 'all')}
                    className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Todos los Profesores
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Excel</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => exportSchedule('excel', 'all')}
                    className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Todos los Profesores
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Imagen</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => exportSchedule('image', 'all')}
                    className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Todos los Horarios
                  </button>
                  <button
                    onClick={() => exportSchedule('image', 'all', 0)}
                    className="w-full px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    Profesores
                  </button>
                </div>
              </div>
            </div>
          </div>
 
          {/* Asignar Horario Manual */}
          <div className="my-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Asignar Horario Manual</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(Number(e.target.value) || '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar Curso</option>
                    {courses.map((course) => (
                      <option key={course.courseId} value={course.courseId}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar Día</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(Number(e.target.value) || '');
                      setSelectedTeacher('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar Materia</option>
                    {subjects.map((subject) => (
                      <option key={subject.subjectId} value={subject.subjectId}>
                        {subject.subjectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profesor asociado a la materia</label>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(Number(e.target.value) || '')}
                    disabled={!selectedSubject}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar Profesor</option>
                    {filteredTeachers.map((teacher) => (
                      <option key={teacher.teacherId} value={teacher.teacherId}>
                        {teacher.teacherName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={clearForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Vaciar contenido
                </button>
                <button
                  onClick={addToSchedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Añadir al horario
                </button>
              </div>
            </div>
 
            {/* Mostrar Horario del Curso */}
            {courseSchedules.length > 0 && (
              <div className="my-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Horario del Curso</h2>
                    <button
                      onClick={() => router.push('/dashboard/schedule/scheduleCourse')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Guardar Horario
                    </button>
                  </div>
                  {renderScheduleTable(courseSchedules)}
                </div>
              </div>
            )}
 
          </div>
        </div>
      </div>
    </>
  );
}
