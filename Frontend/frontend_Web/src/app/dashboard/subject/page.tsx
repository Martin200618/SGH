import HeaderSubject from "@/components/subject/HeaderSubject";
import SubjectTable from "@/components/subject/SubjectTable";
import SearchBar from "@/components/dashboard/SearchBar";

export default function SubjectPage() {
  return (
    <>
      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderSubject />
        <div className="my-6">
          <SearchBar />
        </div>
        {/* Aquí va el contenido específico de la página de materias */}
        <div className="my-6">
          <SubjectTable />
        </div>
      </div>
    </>
  );
}
