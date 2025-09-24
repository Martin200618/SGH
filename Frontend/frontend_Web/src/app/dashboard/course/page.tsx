"use client";

import { useState, useEffect } from "react";
import HeaderCourse from "@/components/course/HeaderCourse";
import TableCourse from "@/components/course/TableCourse";
import CourseModal from "@/components/course/CourseModal";
import SearchBar from "@/components/dashboard/SearchBar";
import { getAllCourses, createCourse, updateCourse, deleteCourse, Course } from "@/api/services/courseApi";
import { getAllTeachers, Teacher } from "@/api/services/teacherApi";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default function CoursePage() {
  const [courses, setCourses] = useState<{ courseId: number; courseName: string; directorName?: string }[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<{ courseId: number; courseName: string; directorName?: string }[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

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

  useEffect(() => {
    handleSearch(''); // Initialize with all courses when data loads
  }, [courses]);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (courseData: Omit<Course, 'courseId'>) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      if (editingCourse) {
        // Editar curso existente
        await updateCourse(editingCourse.courseId, {
          courseName: courseData.courseName,
          gradeDirectorId: courseData.gradeDirectorId,
        });
        setSuccessMessage('Curso actualizado correctamente');
      } else {
        // Agregar nuevo curso
        await createCourse({
          courseName: courseData.courseName,
          gradeDirectorId: courseData.gradeDirectorId,
        });
        setSuccessMessage('Curso creado correctamente');
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
      setFilteredCourses(mappedCourses);
      handleSearch(''); // Initialize search with all records
      setFilteredCourses(mappedCourses);
      setFilteredCourses(mappedCourses);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving course:", error);
      setErrorMessage(error.message || 'Error al guardar el curso');
      setSuccessMessage('');
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

  const handleDeleteCourse = (id: number) => {
    setCourseToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (courseToDelete) {
      try {
        setErrorMessage('');
        setSuccessMessage('');
        await deleteCourse(courseToDelete);
        setSuccessMessage('Curso eliminado correctamente');
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
        setSuccessMessage('');
      }
    }
    setIsConfirmModalOpen(false);
    setCourseToDelete(null);
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.courseName.toLowerCase().includes(query.toLowerCase()) ||
        (course.directorName && course.directorName.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredCourses(filtered);
    }
  };

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderCourse onAddCourse={handleAddCourse} />
        <div className="my-6">
          <SearchBar placeholder="Buscar cursos por nombre o director..." onSearch={handleSearch} />
        </div>
        {errorMessage && (
          <div className="my-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="my-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        <div className="my-6">
          <TableCourse
            courses={filteredCourses}
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

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Confirmar eliminación</h2>
            <p className="mb-6">
              ¿Estás seguro de que deseas eliminar el curso "{courses.find(c => c.courseId === courseToDelete)?.courseName}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}