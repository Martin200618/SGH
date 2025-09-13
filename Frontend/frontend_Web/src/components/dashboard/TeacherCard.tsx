type TeacherCardProps = {
  name: string;
  stats: { materias: number; cursos: number; horas: number };
};

export default function TeacherCard({ name, stats }: TeacherCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <h2 className="font-medium">{name}</h2>
      </div>
      <div className="flex justify-between mt-3 text-sm text-gray-500">
        <span>📘 {stats.materias}</span>
        <span>📚 {stats.cursos}</span>
        <span>⏱ {stats.horas}</span>
      </div>
    </div>
  );
}
