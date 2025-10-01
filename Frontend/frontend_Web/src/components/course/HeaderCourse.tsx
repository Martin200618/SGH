interface HeaderCourseProps {
  onAddCourse: () => void;
}

export default function HeaderCourse({ onAddCourse }: HeaderCourseProps) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
      <div>
        <h1 className="text-4xl font-semibold">Cursos 🎓</h1>
        <p className="">Gestiona la información de los cursos aquí.</p>
      </div>
      <button
        onClick={onAddCourse}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Agregar Curso
      </button>
    </div>
  );
}
