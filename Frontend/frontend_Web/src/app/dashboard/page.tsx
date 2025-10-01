"use client";

import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import TeacherCard from "@/components/dashboard/TeacherCard";
import { getAllTeachers, Teacher } from "@/api/services/teacherApi";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const [teachers, setTeachers] = useState<{ name: string; stats: { materias: number; cursos: number; horas: number } }[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTeachers = async () => {
      try {
        const teachersData: Teacher[] = await getAllTeachers();
        // TODO: Obtener stats reales desde la API cuando esté disponible
        const mappedTeachers = teachersData.map((teacher) => ({
          name: teacher.teacherName,
          stats: { materias: 1, cursos: 1, horas: 25 }, // Temporal: implementar API de stats
        }));
        setTeachers(mappedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, [isAuthenticated]);

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-">
        <Header />

        {/* Cards Profesores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          {teachers.map((t, i) => (
            <TeacherCard key={i} name={t.name} />
          ))}
        </div>

        {/* Reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        </div>
      </div>
    </>
  );
}
