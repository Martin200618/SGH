// Orden de los días de la semana para mostrar correctamente
export const DAYS_ORDER = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

// Mapeo de días en inglés a español (por si el backend devuelve en inglés)
export const DAY_TRANSLATIONS: Record<string, string> = {
  'Monday': 'Lunes',
  'Tuesday': 'Martes',
  'Wednesday': 'Miércoles',
  'Thursday': 'Jueves',
  'Friday': 'Viernes',
  'Saturday': 'Sábado',
  'Sunday': 'Domingo',
  // También aceptar versiones en español
  'Lunes': 'Lunes',
  'Martes': 'Martes',
  'Miércoles': 'Miércoles',
  'Jueves': 'Jueves',
  'Viernes': 'Viernes',
  'Sábado': 'Sábado',
  'Domingo': 'Domingo'
};

export type DayOfWeek = typeof DAYS_ORDER[number];