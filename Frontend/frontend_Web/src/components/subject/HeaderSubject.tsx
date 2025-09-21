interface HeaderSubjectProps {
  onAddSubject: () => void;
}

export default function HeaderSubject({ onAddSubject }: HeaderSubjectProps) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
      <div>
        <h1 className="text-4xl font-semibold">Materias 📚</h1>
        <p className="">Gestiona la información de las materias aquí.</p>
      </div>
      <button
        onClick={onAddSubject}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Agregar Materia
      </button>
    </div>
  );
}
