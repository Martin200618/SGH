"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, FileSpreadsheet, Image } from "lucide-react";
import SearchBar from "@/components/dashboard/SearchBar";
import HeaderSchedule from "@/components/schedule/scheduleCourse/HeaderSchedule";
import { getScheduleHistory, generateSchedule, ScheduleHistory, Schedule, createSchedule, getSchedulesByCourse } from "@/api/services/scheduleApi";
import { getAllCourses, Course } from "@/api/services/courseApi";
import { getAllSubjects, Subject } from "@/api/services/subjectApi";
import { getAllTeachers, Teacher, getTeacherAvailability } from "@/api/services/teacherApi";
import Cookies from 'js-cookie';

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
  const [filteredHistory, setFilteredHistory] = useState<ScheduleHistory[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para formulario manual
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherAvailabilities, setTeacherAvailabilities] = useState<{ [key: number]: any[] }>({});
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<number | ''>('');
  const [selectedTeacher, setSelectedTeacher] = useState<number | ''>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [scheduleEntries, setScheduleEntries] = useState<Schedule[]>([]);
  const [courseSchedules, setCourseSchedules] = useState<Schedule[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  useEffect(() => {
    const token = Cookies.get('token');

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

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

  useEffect(() => {
    if (selectedSubject) {
      const teachersForSubject = teachers.filter(t => t.subjectId === selectedSubject);
      const loadAvailabilities = async () => {
        const availabilities: { [key: number]: any[] } = {};
        for (const teacher of teachersForSubject) {
          try {
            const avails = await getTeacherAvailability(teacher.teacherId);
            availabilities[teacher.teacherId] = avails;
          } catch (error) {
            console.error(`Error loading availability for teacher ${teacher.teacherId}:`, error);
          }
        }
        setTeacherAvailabilities(availabilities);
      };
      loadAvailabilities();
    } else {
      setTeacherAvailabilities({});
    }
  }, [selectedSubject, teachers]);

  const loadHistory = async () => {
    try {
      const data = await getScheduleHistory();
      setHistory(data.content);
      setFilteredHistory(data.content);
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
      setErrorMessage("Error al generar horario");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(item =>
        item.status.toLowerCase().includes(query.toLowerCase()) ||
        item.message?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
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
    setErrorMessage('');
    if (!selectedCourse || !selectedDay || !selectedSubject || !selectedTeacher || !startTime || !endTime) {
      setErrorMessage('Por favor complete todos los campos');
      return;
    }

    // Validar que no se programe durante los descansos
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);

    // Convertir a minutos desde medianoche para facilitar comparación
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Descanso de 9:00 AM (30 minutos)
    const breakStart = 9 * 60; // 9:00 AM
    const breakEnd = 9 * 60 + 30; // 9:30 AM

    // Almuerzo de 12:00 PM (1 hora)
    const lunchStart = 12 * 60; // 12:00 PM
    const lunchEnd = 13 * 60; // 1:00 PM

    // Verificar si el horario se solapa con el descanso
    if ((startMinutes < breakEnd && endMinutes > breakStart) ||
        (startMinutes < lunchEnd && endMinutes > lunchStart)) {
      setErrorMessage('No se puede programar clases durante los tiempos de descanso (9:00-9:30 AM) o almuerzo (12:00-1:00 PM)');
      return;
    }
    const course = courses.find(c => c.courseId === selectedCourse);
    const subject = subjects.find(s => s.subjectId === selectedSubject);
    const teacher = teachers.find(t => t.teacherId === selectedTeacher);
    if (!course || !subject || !teacher) return;

    // Validar disponibilidad del profesor
    const availabilities = await getTeacherAvailability(selectedTeacher);
    const dayAvailability = availabilities.find(a => a.day === selectedDay);
    if (!dayAvailability) {
      setErrorMessage('El profesor no tiene disponibilidad en ese día');
      return;
    }
    const inAM = dayAvailability.amStart && dayAvailability.amEnd && startTime >= dayAvailability.amStart && endTime <= dayAvailability.amEnd;
    const inPM = dayAvailability.pmStart && dayAvailability.pmEnd && startTime >= dayAvailability.pmStart && endTime <= dayAvailability.pmEnd;
    if (!inAM && !inPM) {
      setErrorMessage('El profesor no tiene disponibilidad en ese horario');
      return;
    }

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
      setErrorMessage("Error al crear el horario");
    }
  };

  const filteredTeachers = teachers.filter(t => {
    if (!selectedSubject || t.subjectId !== selectedSubject) return false;
    if (!selectedDay) return true;
    const avails = teacherAvailabilities[t.teacherId];
    if (!avails) return false;
    return avails.some(a => a.day === selectedDay);
  });

  const formatAvailability = (avails: any[], selectedDay: string) => {
    if (!avails || avails.length === 0) return 'No hay disponibilidad registrada';
    if (!selectedDay) {
      return avails.map(avail => {
        const am = avail.amStart && avail.amEnd ? `AM: ${avail.amStart}-${avail.amEnd}` : '';
        const pm = avail.pmStart && avail.pmEnd ? `PM: ${avail.pmStart}-${avail.pmEnd}` : '';
        const times = [am, pm].filter(Boolean).join(', ');
        return `${avail.day}: ${times}`;
      }).join('; ');
    }
    const dayAvail = avails.find(a => a.day === selectedDay);
    if (!dayAvail) return 'No tiene disponibilidad en este día';
    const parts = [];
    if (dayAvail.amStart && dayAvail.amEnd) {
      parts.push(`AM: ${dayAvail.amStart}-${dayAvail.amEnd}`);
    }
    if (dayAvail.pmStart && dayAvail.pmEnd) {
      parts.push(`PM: ${dayAvail.pmStart}-${dayAvail.pmEnd}`);
    }
    if (parts.length === 0) return 'No tiene horarios disponibles en este día';
    return `${selectedDay}: ${parts.join(', ')}`;
  };

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
    // Always include break times
    timeSet.add('08:00');
    timeSet.add('12:00');
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

  const renderScheduleTable = (schedules: Schedule[], courseId?: number) => {
    const times = generateTimes(schedules);
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const course = courseId ? courses.find(c => c.courseId === courseId) : null;
    const courseName = course ? course.courseName : 'Curso';

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Horario del {courseName}</h3>
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
                    const isLunch = time === "12:00 PM - 1:00 PM";
                    const isBreak = time === "8:00 AM - 9:00 AM";
                    const content = schedule ? `${schedule.teacherName || 'Profesor'}/${schedule.subjectName || 'Materia'}` : isLunch ? "Almuerzo" : isBreak ? "Descanso" : "";

                    return (
                      <td
                        key={day}
                        className={`px-6 py-4 text-center text-sm ${
                          isLunch
                            ? 'bg-orange-100 text-orange-800 font-medium'
                            : isBreak
                              ? 'bg-yellow-100 text-yellow-800 font-medium'
                              : content
                                ? 'bg-blue-100 text-blue-800 font-medium'
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
          <SearchBar placeholder="Buscar por estado o mensaje..." onSearch={handleSearch} />
        </div>

        {errorMessage && (
          <div className="my-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-red-500">×</span>
            </button>
          </div>
        )}

        {/* Reportes */}
        <div className="my-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="mr-2">📤</span>
              Exportar Horarios
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 cursor-pointer border border-red-200 hover:border-red-300 hover:shadow-lg hover:-translate-y-1" onClick={() => exportSchedule('pdf', 'all')}>
                <div className="p-3 bg-red-500 rounded-full mb-3 group-hover:bg-red-600 transition-colors">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800 mb-1">PDF</span>
                <span className="text-xs text-gray-600">Profesores</span>
              </div>
              <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 cursor-pointer border border-green-200 hover:border-green-300 hover:shadow-lg hover:-translate-y-1" onClick={() => exportSchedule('excel', 'all')}>
                <div className="p-3 bg-green-500 rounded-full mb-3 group-hover:bg-green-600 transition-colors">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800 mb-1">Excel</span>
                <span className="text-xs text-gray-600">Profesores</span>
              </div>
              <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1" onClick={() => exportSchedule('image', 'all')}>
                <div className="p-3 bg-blue-500 rounded-full mb-3 group-hover:bg-blue-600 transition-colors">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800 mb-1">Imagen</span>
                <span className="text-xs text-gray-600">Horarios</span>
              </div>
              <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 cursor-pointer border border-purple-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1" onClick={() => exportSchedule('image', 'all', 0)}>
                <div className="p-3 bg-purple-500 rounded-full mb-3 group-hover:bg-purple-600 transition-colors">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800 mb-1">Imagen</span>
                <span className="text-xs text-gray-600">Profesores</span>
              </div>
            </div>
          </div>
 
          {/* Asignar Horario Manual */}
          <div className="my-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="mr-2">✏️</span>
                Asignar Horario Manual
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Curso</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(Number(e.target.value) || '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Día</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Materia</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(Number(e.target.value) || '');
                      setSelectedTeacher('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profesor asociado a la materia</label>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(Number(e.target.value) || '')}
                    disabled={!selectedSubject}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Seleccionar Profesor</option>
                    {filteredTeachers.map((teacher) => (
                      <option key={teacher.teacherId} value={teacher.teacherId}>
                        {teacher.teacherName}
                      </option>
                    ))}
                  </select>
                  {selectedTeacher && teacherAvailabilities[selectedTeacher] && selectedDay && (() => {
                    const dayAvail = teacherAvailabilities[selectedTeacher].find(a => a.day === selectedDay);
                    if (!dayAvail) return <p className="text-red-600 text-sm mt-1">No tiene disponibilidad en este día</p>;
                    return (
                      <div className="text-red-600 text-sm mt-1">
                        Disponibilidad:
                        {dayAvail.amStart && dayAvail.amEnd && <div>AM: {dayAvail.amStart}-{dayAvail.amEnd}</div>}
                        {dayAvail.pmStart && dayAvail.pmEnd && <div>PM: {dayAvail.pmStart}-{dayAvail.pmEnd}</div>}
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Inicio</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Fin</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={clearForm}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  🗑️ Vaciar contenido
                </button>
                <button
                  onClick={addToSchedule}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  ➕ Añadir al horario
                </button>
              </div>
            </div>

            {/* Ver Horario de Curso */}
            <div className="my-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-2">📅</span>
                  Ver Horario de Curso
                </h3>
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Curso</label>
                  <select
                    value={selectedCourse || ''}
                    onChange={(e) => {
                      const courseId = Number(e.target.value) || '';
                      setSelectedCourse(courseId);
                      if (courseId) loadCourseSchedules(courseId);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
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

            {/* Mostrar Horario del Curso */}
            {selectedCourse && (
              <div className="my-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <span className="mr-2">📋</span>
                      Horario del Curso
                    </h2>
                    <button
                      onClick={() => router.push('/dashboard/schedule/scheduleCourse')}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                    >
                      💾 Guardar Horario
                    </button>
                  </div>
                  {renderScheduleTable(courseSchedules, selectedCourse ? Number(selectedCourse) : undefined)}
                </div>
              </div>
            )}
 
          </div>
        </div>
      </div>
    </>
  );
}
