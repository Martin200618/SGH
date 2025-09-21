interface HeaderProfessorProps {
  onAddProfessor: () => void;
}

export default function HeaderProfessor({ onAddProfessor }: HeaderProfessorProps) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
      <div>
        <h1 className="text-4xl font-semibold">Profesores 👨‍🏫</h1>
        <p className="">Gestiona la información de los profesores aquí.</p>
      </div>
      <button
        onClick={onAddProfessor}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Agregar Profesor
      </button>
    </div>
  );
}
