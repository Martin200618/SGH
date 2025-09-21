"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import HeaderSchedule from "@/components/schedule/scheduleCourse/HeaderSchedule";
import ScheduleTable from "@/components/schedule/scheduleCourse/ScheduleTable";
import ScheduleModal from "@/components/schedule/scheduleCourse/ScheduleModal";
import { getAllSchedules, Schedule } from "@/api/services/scheduleApi";
import { getAllCourses, Course } from "@/api/services/courseApi";

export default function ScheduleCoursePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleRegenerateSchedule = () => {
    alert('Regenerar horario - Funcionalidad requiere implementación en backend');
    setIsModalOpen(false);
  };

  const handleDeleteSchedule = () => {
    alert('Eliminar horario - Funcionalidad requiere implementación en backend');
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
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
          <ScheduleTable
            schedulesByCourse={schedulesByCourse}
            courses={courses}
            onEdit={handleEditSchedule}
            onDelete={handleDeleteSchedule}
          />
        </div>

        {/* Reportes */}

      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRegenerate={handleRegenerateSchedule}
        onDelete={handleDeleteSchedule}
        courseName={selectedCourse?.courseName || ''}
      />
    </>
  );
}
