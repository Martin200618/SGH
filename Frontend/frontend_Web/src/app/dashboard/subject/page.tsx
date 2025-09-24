"use client";

import { useState, useEffect } from "react";
import HeaderSubject from "@/components/subject/HeaderSubject";
import SubjectTable from "@/components/subject/SubjectTable";
import SubjectModal from "@/components/subject/SubjectModal";
import SearchBar from "@/components/dashboard/SearchBar";
import { getAllSubjects, createSubject, updateSubject, deleteSubject, Subject } from "@/api/services/subjectApi";
import { getAllTeachers } from "@/api/services/teacherApi";

export default function SubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsData, teachersData] = await Promise.all([
          getAllSubjects(),
          getAllTeachers()
        ]);
        // Calcular profesores asociados
        const subjectsWithCount = subjectsData.map(subject => ({
          ...subject,
          profesoresAsociados: teachersData.filter(teacher => teacher.subjectId === subject.subjectId).length
        }));
        setSubjects(subjectsWithCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddSubject = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleSaveSubject = async (subjectData: Omit<Subject, 'subjectId'>) => {
    try {
      setErrorMessage('');
      if (editingSubject) {
        // Editar materia existente
        await updateSubject(editingSubject.subjectId, { subjectName: subjectData.subjectName });
      } else {
        // Agregar nueva materia
        await createSubject({ subjectName: subjectData.subjectName });
      }
      // Refetch y recalcular
      const [subjectsData, teachersData] = await Promise.all([
        getAllSubjects(),
        getAllTeachers()
      ]);
      const subjectsWithCount = subjectsData.map(subject => ({
        ...subject,
        profesoresAsociados: teachersData.filter(teacher => teacher.subjectId === subject.subjectId).length
      }));
      setSubjects(subjectsWithCount);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving subject:", error);
      setErrorMessage(error.message || 'Error al guardar la materia');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleEditSubject = (id: number) => {
    const subject = subjects.find(s => s.subjectId === id);
    if (subject) {
      setEditingSubject(subject);
      setIsModalOpen(true);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    const subject = subjects.find(s => s.subjectId === id);
    if (subject && (subject.profesoresAsociados || 0) > 0) {
      setErrorMessage('No se puede eliminar una materia que tiene profesores asociados');
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      try {
        setErrorMessage('');
        await deleteSubject(id);
        // Refetch y recalcular
        const [subjectsData, teachersData] = await Promise.all([
          getAllSubjects(),
          getAllTeachers()
        ]);
        const subjectsWithCount = subjectsData.map(subject => ({
          ...subject,
          profesoresAsociados: teachersData.filter(teacher => teacher.subjectId === subject.subjectId).length
        }));
        setSubjects(subjectsWithCount);
      } catch (error: any) {
        console.error("Error deleting subject:", error);
        setErrorMessage(error.message || 'Error al eliminar la materia');
      }
    }
  };

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderSubject onAddSubject={handleAddSubject} />
        <div className="my-6">
          <SearchBar />
        </div>
        {errorMessage && (
          <div className="my-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        {/* Aquí va el contenido específico de la página de materias */}
        <div className="my-6">
          <SubjectTable
            subjects={subjects}
            onEdit={handleEditSubject}
            onDelete={handleDeleteSubject}
          />
        </div>
      </div>

      <SubjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSubject}
        subject={editingSubject}
      />
    </>
  );
}
