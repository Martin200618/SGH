"use client";

import ProfessorTable from "@/components/professors/ProfessorTable";
import HeaderProfessor from "@/components/professors/HeaderProfessor";
import SearchBar from "@/components/dashboard/SearchBar";

export default function ProfessorPage() {
  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderProfessor />

        <div className="my-6">
                  <SearchBar/>
        </div>
        {/* Tabla de Profesores */}
        <div className="my-6">
          <ProfessorTable />
        </div>

        {/* Reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aquí irán los reportes */}
        </div>
      </div>


    </>
  );
}
