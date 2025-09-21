"use client";

import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import TeacherCard from "@/components/dashboard/TeacherCard";
import ChartBar from "@/components/dashboard/ChartBar";
import ChartDonut from "@/components/dashboard/ChartDonut";
import { getAllTeachers, Teacher } from "@/api/services/teacherApi";

export default function DashboardPage() {
  const [teachers, setTeachers] = useState<{ name: string; stats: { materias: number; cursos: number; horas: number } }[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersData: Teacher[] = await getAllTeachers();
        const mappedTeachers = teachersData.map((teacher) => ({
          name: teacher.teacherName,
          stats: { materias: 1, cursos: 1, horas: 25 }, // Stats hardcodeados por ahora
        }));
        setTeachers(mappedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

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
          <ChartBar />
          <ChartDonut />
        </div>
      </div>
    </>
  );
}
