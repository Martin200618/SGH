"use client";

import { useState } from "react";
import ProfessorTable from "@/components/professors/ProfessorTable";
import HeaderProfessor from "@/components/professors/HeaderProfessor";
import SearchBar from "@/components/dashboard/SearchBar";
import ProfessorModal from "@/components/professors/ProfessorModal";

interface Professor {
  id: number;
  nombre: string;
  especializacion: string;
  disponibilidad: string[];
}

export default function ProfessorPage() {
  const [teachers, setTeachers] = useState<Professor[]>([
    {
      id: 1,
      nombre: 'Sofia',
      especializacion: 'Matematicas',
      disponibilidad: ['Martes', 'Viernes']
    },
    {
      id: 2,
      nombre: 'Valentina',
      especializacion: 'Fisica',
      disponibilidad: ['Lunes', 'Martes']
    },
    {
      id: 3,
      nombre: 'Carol',
      especializacion: 'Quimica',
      disponibilidad: ['Quimica', 'Algebra']
    },
    {
      id: 4,
      nombre: 'Sara',
      especializacion: 'Biologia',
      disponibilidad: ['Biologia', 'Español']
    },
    {
      id: 5,
      nombre: 'Maria',
      especializacion: 'Ingles',
      disponibilidad: ['Ingles', 'Sociales']
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);

  const handleAddProfessor = () => {
    setEditingProfessor(null);
    setIsModalOpen(true);
  };

  const handleSaveProfessor = (professorData: Omit<Professor, 'id'>) => {
    if (editingProfessor) {
      // Editar profesor existente
      setTeachers(teachers.map(t => t.id === editingProfessor.id ? { ...t, ...professorData } : t));
    } else {
      // Agregar nuevo profesor
      const newId = Math.max(...teachers.map(t => t.id)) + 1;
      setTeachers([...teachers, { id: newId, ...professorData }]);
    }
    setIsModalOpen(false);
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

  const handleDeleteProfessor = (id: number) => {
    setTeachers(teachers.filter(t => t.id !== id));
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
      />
    </>
  );
}
