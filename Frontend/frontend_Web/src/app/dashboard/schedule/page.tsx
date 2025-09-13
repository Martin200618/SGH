"use client";

import SearchBar from "@/components/dashboard/SearchBar";
import HeaderSchedule from "@/components/schedule/scheduleCourse/HeaderSchedule";
import ScheduleTable from "@/components/schedule/scheduleCourse/ScheduleTable";

export default function ScheduleProfessorPage() {
  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderSchedule/>

        <div className="my-6">
                  <SearchBar/>
        </div>
        {/* Tabla de Profesores */}
        <div className="my-6">
          <ScheduleTable />
        </div>

        {/* Reportes */}

      </div>


    </>
  );
}
