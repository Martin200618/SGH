export interface ScheduleDTO {
  id: number;
  scheduleName: string;
  courseId: number;
  courseName: string;
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName: string;
  day: string;       // "Lunes"
  startTime: string; // "08:00"
  endTime: string;   // "09:00"
}
