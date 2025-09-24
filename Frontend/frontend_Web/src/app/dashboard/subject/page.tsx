"use client";

import { useState, useEffect } from "react";
import HeaderSubject from "@/components/subject/HeaderSubject";
import SubjectTable from "@/components/subject/SubjectTable";
import SubjectModal from "@/components/subject/SubjectModal";
import SearchBar from "@/components/dashboard/SearchBar";
import { getAllSubjects, createSubject, updateSubject, deleteSubject, Subject } from "@/api/services/subjectApi";
import { getAllTeachers } from "@/api/services/teacherApi";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default function SubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

  useEffect(() => {
    handleSearch(''); // Initialize with all subjects when data loads
  }, [subjects]);

  const handleAddSubject = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleSaveSubject = async (subjectData: Omit<Subject, 'subjectId'>) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      if (editingSubject) {
        // Editar materia existente
        await updateSubject(editingSubject.subjectId, { subjectName: subjectData.subjectName });
        setSuccessMessage('Materia actualizada correctamente');
      } else {
        // Agregar nueva materia
        await createSubject({ subjectName: subjectData.subjectName });
        setSuccessMessage('Materia creada correctamente');
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
      setFilteredSubjects(subjectsWithCount);
      setFilteredSubjects(subjectsWithCount);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving subject:", error);
      setErrorMessage(error.message || 'Error al guardar la materia');
      setSuccessMessage('');
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
        setSuccessMessage('');
        await deleteSubject(id);
        setSuccessMessage('Materia eliminada correctamente');
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
        setSuccessMessage('');
      }
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredSubjects(subjects);
    } else {
      const filtered = subjects.filter(subject =>
        subject.subjectName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  };

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderSubject onAddSubject={handleAddSubject} />
        <div className="my-6">
          <SearchBar placeholder="Buscar materias por nombre..." onSearch={handleSearch} />
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
        {/* Aquí va el contenido específico de la página de materias */}
        <div className="my-6">
          <SubjectTable
            subjects={filteredSubjects}
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
