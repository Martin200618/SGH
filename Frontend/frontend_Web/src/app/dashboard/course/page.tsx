"use client";

import { useState, useEffect } from "react";
import HeaderCourse from "@/components/course/HeaderCourse";
import TableCourse from "@/components/course/TableCourse";
import CourseModal from "@/components/course/CourseModal";
import SearchBar from "@/components/dashboard/SearchBar";
import { getAllCourses, createCourse, updateCourse, deleteCourse, Course } from "@/api/services/courseApi";
import { getAllTeachers, Teacher } from "@/api/services/teacherApi";

export default function CoursePage() {
  const [courses, setCourses] = useState<{ courseId: number; courseName: string; directorName?: string }[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, teachersData] = await Promise.all([
          getAllCourses(),
          getAllTeachers()
        ]);
        setTeachers(teachersData);
        const mappedCourses = coursesData.map((course) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          directorName: course.gradeDirectorId ? teachersData.find(t => t.teacherId === course.gradeDirectorId)?.teacherName : undefined,
        }));
        setCourses(mappedCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (courseData: Omit<Course, 'courseId'>) => {
    try {
      setErrorMessage('');
      if (editingCourse) {
        // Editar curso existente
        await updateCourse(editingCourse.courseId, {
          courseName: courseData.courseName,
          gradeDirectorId: courseData.gradeDirectorId,
        });
      } else {
        // Agregar nuevo curso
        await createCourse({
          courseName: courseData.courseName,
          gradeDirectorId: courseData.gradeDirectorId,
        });
      }
      // Refetch
      const [coursesData, teachersData] = await Promise.all([
        getAllCourses(),
        getAllTeachers()
      ]);
      const mappedCourses = coursesData.map((course) => ({
        courseId: course.courseId,
        courseName: course.courseName,
        directorName: course.gradeDirectorId ? teachersData.find(t => t.teacherId === course.gradeDirectorId)?.teacherName : undefined,
      }));
      setCourses(mappedCourses);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving course:", error);
      setErrorMessage(error.message || 'Error al guardar el curso');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleEditCourse = (id: number) => {
    const course = courses.find(c => c.courseId === id);
    if (course) {
      setEditingCourse({
        courseId: course.courseId,
        courseName: course.courseName,
        gradeDirectorId: teachers.find(t => t.teacherName === course.directorName)?.teacherId,
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      try {
        setErrorMessage('');
        await deleteCourse(id);
        // Refetch
        const [coursesData, teachersData] = await Promise.all([
          getAllCourses(),
          getAllTeachers()
        ]);
        const mappedCourses = coursesData.map((course) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          directorName: course.gradeDirectorId ? teachersData.find(t => t.teacherId === course.gradeDirectorId)?.teacherName : undefined,
        }));
        setCourses(mappedCourses);
      } catch (error: any) {
        console.error("Error deleting course:", error);
        setErrorMessage(error.message || 'Error al eliminar el curso');
      }
    }
  };

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderCourse onAddCourse={handleAddCourse} />
        <div className="my-6">
          <SearchBar />
        </div>
        {errorMessage && (
          <div className="my-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        <div className="my-6">
          <TableCourse
            courses={courses}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        </div>
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
        course={editingCourse}
        teachers={teachers}
      />
    </>
  );
}