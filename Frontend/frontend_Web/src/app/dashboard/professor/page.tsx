"use client";

import { useState, useEffect } from "react";
import HeaderProfessor from "@/components/professors/HeaderProfessor";
import ProfessorTable from "@/components/professors/ProfessorTable";
import ProfessorModal from "@/components/professors/ProfessorModal";
import AvailabilityModal from "@/components/professors/AvailabilityModal";
import SearchBar from "@/components/dashboard/SearchBar";
import { getAllTeachers, createTeacher, updateTeacher, deleteTeacher, getTeacherAvailability, Teacher, TeacherAvailability } from "@/api/services/teacherApi";
import { getAllSubjects, Subject } from "@/api/services/subjectApi";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

interface TeacherWithSubject extends Teacher {
  subjectName?: string;
  availabilityDays?: string;
}

export default function ProfessorPage() {
  const [teachers, setTeachers] = useState<TeacherWithSubject[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherWithSubject[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedTeacherForAvailability, setSelectedTeacherForAvailability] = useState<{id: number, name: string} | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<TeacherWithSubject | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

    fetchData();
  }, []);

  useEffect(() => {
    handleSearch(''); // Initialize with all professors when data loads
  }, [teachers]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersData, subjectsData] = await Promise.all([
        getAllTeachers(),
        getAllSubjects()
      ]);

      // Cargar disponibilidad para cada profesor
      const teachersWithAvailability = await Promise.all(
        teachersData.map(async (teacher) => {
          try {
            const availability = await getTeacherAvailability(teacher.teacherId);
            const availabilityDays = availability.length > 0
              ? availability.map(a => a.day).join(', ')
              : 'No configurada';

            return {
              ...teacher,
              subjectName: subjectsData.find(subject => subject.subjectId === teacher.subjectId)?.subjectName,
              availabilityDays
            };
          } catch (error) {
            console.error(`Error loading availability for teacher ${teacher.teacherId}:`, error);
            return {
              ...teacher,
              subjectName: subjectsData.find(subject => subject.subjectId === teacher.subjectId)?.subjectName,
              availabilityDays: 'No configurada'
            };
          }
        })
      );

      setTeachers(teachersWithAvailability);
      setFilteredTeachers(teachersWithAvailability);
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfessor = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleSaveTeacher = async (teacherData: Omit<Teacher, 'teacherId'>) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      if (editingTeacher) {
        // Editar profesor existente
        await updateTeacher(editingTeacher.teacherId, {
          teacherName: teacherData.teacherName,
          subjectId: teacherData.subjectId
        });
        setSuccessMessage('Profesor actualizado correctamente');
      } else {
        // Agregar nuevo profesor
        await createTeacher({
          teacherName: teacherData.teacherName,
          subjectId: teacherData.subjectId
        });
        setSuccessMessage('Profesor creado correctamente');
      }
      await fetchData(); // Refetch data including availability
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving teacher:", error);
      setErrorMessage(error.message || 'Error al guardar el profesor');
      setSuccessMessage('');
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const handleOpenAvailabilityModal = (teacher: TeacherWithSubject) => {
    setSelectedTeacherForAvailability({ id: teacher.teacherId, name: teacher.teacherName });
    setIsAvailabilityModalOpen(true);
  };

  const handleCloseAvailabilityModal = () => {
    setIsAvailabilityModalOpen(false);
    setSelectedTeacherForAvailability(null);
  };

  const handleAvailabilityUpdated = (teacherId: number, availabilityDays: string) => {
    // Actualizar el profesor específico en el estado sin recargar todos los datos
    setTeachers(prevTeachers =>
      prevTeachers.map(teacher =>
        teacher.teacherId === teacherId
          ? { ...teacher, availabilityDays }
          : teacher
      )
    );
  };

  const handleEditTeacher = (teacher: TeacherWithSubject) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = async (id: number) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await deleteTeacher(id);
      setSuccessMessage('Profesor eliminado correctamente');
      await fetchData(); // Refetch data including availability
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
      setErrorMessage(error.message || 'Error al eliminar el profesor');
      setSuccessMessage('');
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher =>
        teacher.teacherName.toLowerCase().includes(query.toLowerCase()) ||
        (teacher.subjectName && teacher.subjectName.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredTeachers(filtered);
    }
  };

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderProfessor onAddProfessor={handleAddProfessor} />
        <div className="my-6">
          <SearchBar placeholder="Buscar profesores por nombre o materia..." onSearch={handleSearch} />
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
        {loading ? (
          <div className="my-6 text-center">
            <p className="text-gray-500">Cargando profesores...</p>
          </div>
        ) : (
          <div className="my-6">
            <ProfessorTable
              teachers={filteredTeachers}
              onEdit={handleEditTeacher}
              onDelete={handleDeleteTeacher}
              onManageAvailability={handleOpenAvailabilityModal}
            />
          </div>
        )}
      </div>

      <ProfessorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTeacher}
        teacher={editingTeacher}
      />

      {selectedTeacherForAvailability && (
        <AvailabilityModal
          isOpen={isAvailabilityModalOpen}
          onClose={handleCloseAvailabilityModal}
          teacherId={selectedTeacherForAvailability.id}
          teacherName={selectedTeacherForAvailability.name}
          onAvailabilityUpdated={handleAvailabilityUpdated}
        />
      )}
    </>
  );
}