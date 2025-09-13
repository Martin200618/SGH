"use client";

import Header from "@/components/dashboard/Header";
import TeacherCard from "@/components/dashboard/TeacherCard";
import ChartBar from "@/components/dashboard/ChartBar";
import ChartDonut from "@/components/dashboard/ChartDonut";

export default function DashboardPage() {
  const teachers = [
    { name: "Marcela Rodriguez", stats: { materias: 1, cursos: 1, horas: 25 } },
    { name: "Jhan Carlos Rodriguez", stats: { materias: 1, cursos: 1, horas: 25 } },
    { name: "Lidia Stefany Toledo", stats: { materias: 1, cursos: 1, horas: 25 } },
    { name: "Juan Camilo Rodriguez", stats: { materias: 1, cursos: 1, horas: 25 } },
    { name: "Nuri Yineth Polo Ruiz", stats: { materias: 1, cursos: 1, horas: 25 } },
    { name: "Juan Camilo Perdomo", stats: { materias: 1, cursos: 1, horas: 25 } },
    { name: "Maria Luz Angela Perez", stats: { materias: 1, cursos: 1, horas: 25 } },
    { name: "Anny Ramos Guzman", stats: { materias: 1, cursos: 1, horas: 25 } },
  ];

  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-">
        <Header />

        {/* Cards Profesores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          {teachers.map((t, i) => (
            <TeacherCard key={i} name={t.name} stats={t.stats} />
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
