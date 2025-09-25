export interface ScheduleDTO {
  id: number;
  courseId: number;              // 👈 referencia al curso
  courseName?: string;           // opcional, si backend lo incluye
  teacherId?: number;
  teacherName: string;
  subjectId?: number;
  subjectName: string;
  day: string;                   // "Lunes"
  startTime: string;             // "08:00"
  endTime: string;               // "09:00"
}
