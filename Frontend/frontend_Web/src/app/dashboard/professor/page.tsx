"use client";

import { useState, useEffect } from "react";
import ProfessorTable from "@/components/professors/ProfessorTable";
import HeaderProfessor from "@/components/professors/HeaderProfessor";
import SearchBar from "@/components/dashboard/SearchBar";
import ProfessorModal from "@/components/professors/ProfessorModal";
import { getAllTeachers, createTeacher, updateTeacher, deleteTeacher, Teacher } from "@/api/services/teacherApi";
import { getAllSubjects, Subject } from "@/api/services/subjectApi";

interface Professor {
  id: number;
  nombre: string;
  especializacion: string;
  subjectId: number;
}

export default function ProfessorPage() {
  const [teachers, setTeachers] = useState<Professor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersData, subjectsData] = await Promise.all([
          getAllTeachers(),
          getAllSubjects()
        ]);
        setSubjects(subjectsData);
        const mappedTeachers = teachersData.map((teacher) => ({
          id: teacher.teacherId,
          nombre: teacher.teacherName,
          especializacion: subjectsData.find(s => s.subjectId === teacher.subjectId)?.subjectName || "Sin especialización",
          subjectId: teacher.subjectId,
        }));
        setTeachers(mappedTeachers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddProfessor = () => {
    setEditingProfessor(null);
    setIsModalOpen(true);
  };

  const handleSaveProfessor = async (professorData: Omit<Professor, 'id'>) => {
    try {
      const subjectId = subjects.find(s => s.subjectName === professorData.especializacion)?.subjectId || 1;
      if (editingProfessor) {
        // Editar profesor existente
        await updateTeacher(editingProfessor.id, { teacherName: professorData.nombre, subjectId });
      } else {
        // Agregar nuevo profesor
        await createTeacher({ teacherName: professorData.nombre, subjectId });
      }
      // Refetch teachers
      const data: Teacher[] = await getAllTeachers();
      const mappedTeachers = data.map((teacher) => ({
        id: teacher.teacherId,
        nombre: teacher.teacherName,
        especializacion: subjects.find(s => s.subjectId === teacher.subjectId)?.subjectName || "Sin especialización",
        subjectId: teacher.subjectId,
      }));
      setTeachers(mappedTeachers);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving professor:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProfessor(null);
  };

  const handleEditProfessor = (id: number) => {
    const professor = teachers.find(t => t.id === id);
    if (professor) {
      setEditingProfessor(professor);
      setIsModalOpen(true);
    }
  };

  const handleDeleteProfessor = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      try {
        await deleteTeacher(id);
        // Refetch teachers
        const data: Teacher[] = await getAllTeachers();
        const mappedTeachers = data.map((teacher) => ({
          id: teacher.teacherId,
          nombre: teacher.teacherName,
          especializacion: subjects.find(s => s.subjectId === teacher.subjectId)?.subjectName || "Sin especialización",
          subjectId: teacher.subjectId,
        }));
        setTeachers(mappedTeachers);
      } catch (error) {
        console.error("Error deleting professor:", error);
      }
    }
  };
  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderProfessor onAddProfessor={handleAddProfessor} />

        <div className="my-6">
                  <SearchBar/>
        </div>
        {/* Tabla de Profesores */}
        <div className="my-6">
          <ProfessorTable
            teachers={teachers}
            onEdit={handleEditProfessor}
            onDelete={handleDeleteProfessor}
          />
        </div>

        {/* Reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aquí irán los reportes */}
        </div>
      </div>

      <ProfessorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProfessor}
        professor={editingProfessor}
        subjects={subjects}
      />
    </>
  );
}
