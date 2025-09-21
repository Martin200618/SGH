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
    } catch (error) {
      console.error("Error saving subject:", error);
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
    if (window.confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      try {
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
      } catch (error) {
        console.error("Error deleting subject:", error);
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
