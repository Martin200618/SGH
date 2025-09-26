package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.TeacherDTO;
import com.horarios.SGH.Model.TeacherAvailability;
import com.horarios.SGH.Model.TeacherSubject;
import com.horarios.SGH.Model.schedule;
import com.horarios.SGH.Model.subjects;
import com.horarios.SGH.Model.teachers;
import com.horarios.SGH.Repository.IScheduleRepository;
import com.horarios.SGH.Repository.ITeacherAvailabilityRepository;
import com.horarios.SGH.Repository.Isubjects;
import com.horarios.SGH.Repository.Iteachers;
import com.horarios.SGH.Repository.TeacherSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService implements ITeacherService {

    private final Isubjects subjectRepo;
    private final Iteachers teacherRepo;
    private final TeacherSubjectRepository teacherSubjectRepo;
    private final ITeacherAvailabilityRepository availabilityRepo;
    private final IScheduleRepository scheduleRepo;

    /**
     * Crea un docente. Si se envía subjectId, crea también la relación TeacherSubject.
     */
    public TeacherDTO create(TeacherDTO dto) {
        teachers teacher = new teachers();
        teacher.setTeacherName(dto.getTeacherName());
        teachers savedTeacher = teacherRepo.save(teacher);

        if (dto.getSubjectId() > 0) {
            subjects subject = subjectRepo.findById(dto.getSubjectId()).orElseThrow();
            TeacherSubject ts = new TeacherSubject();
            ts.setTeacher(savedTeacher);
            ts.setSubject(subject);
            teacherSubjectRepo.save(ts);
        }

        dto.setTeacherId(savedTeacher.getId());
        return dto;
    }

    /**
     * Lista todos los docentes. Si tienen relaciones TeacherSubject, devuelve el primer subjectId encontrado.
     */
    public List<TeacherDTO> getAll() {
        return teacherRepo.findAll().stream().map(t -> {
            TeacherDTO dto = new TeacherDTO();
            dto.setTeacherId(t.getId());
            dto.setTeacherName(t.getTeacherName());

            // Compatibilidad: si existe relación TeacherSubject, usamos el primer subjectId
            List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(t.getId());
            if (!tsList.isEmpty()) {
                dto.setSubjectId(tsList.get(0).getSubject().getId());
            } else {
                dto.setSubjectId(0);
            }

            // Resumen de disponibilidad
            List<TeacherAvailability> availabilities = availabilityRepo.findByTeacher_Id(t.getId());
            if (!availabilities.isEmpty()) {
                String days = availabilities.stream()
                    .filter(a -> a.hasValidSchedule())
                    .map(a -> a.getDay().toString())
                    .collect(Collectors.joining(", "));
                dto.setAvailabilitySummary(days.isEmpty() ? "Sin disponibilidad" : days);
            } else {
                dto.setAvailabilitySummary("Sin disponibilidad");
            }

            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Obtiene un docente por ID.
     */
    public TeacherDTO getById(int id) {
        return teacherRepo.findById(id).map(t -> {
            TeacherDTO dto = new TeacherDTO();
            dto.setTeacherId(t.getId());
            dto.setTeacherName(t.getTeacherName());

            List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(t.getId());
            if (!tsList.isEmpty()) {
                dto.setSubjectId(tsList.get(0).getSubject().getId());
            } else {
                dto.setSubjectId(0);
            }

            // Resumen de disponibilidad
            List<TeacherAvailability> availabilities = availabilityRepo.findByTeacher_Id(t.getId());
            if (!availabilities.isEmpty()) {
                String days = availabilities.stream()
                    .filter(a -> a.hasValidSchedule())
                    .map(a -> a.getDay().toString())
                    .collect(Collectors.joining(", "));
                dto.setAvailabilitySummary(days.isEmpty() ? "Sin disponibilidad" : days);
            } else {
                dto.setAvailabilitySummary("Sin disponibilidad");
            }

            return dto;
        }).orElse(null);
    }

    /**
     * Actualiza un docente y su relación con materia.
     */
    public TeacherDTO update(int id, TeacherDTO dto) {
        teachers teacher = teacherRepo.findById(id).orElse(null);
        if (teacher == null) return null;

        teacher.setTeacherName(dto.getTeacherName());
        teachers updatedTeacher = teacherRepo.save(teacher);

        // Actualizar relación TeacherSubject
        if (dto.getSubjectId() > 0) {
            subjects subject = subjectRepo.findById(dto.getSubjectId()).orElseThrow();
            List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(id);
            if (tsList.isEmpty()) {
                TeacherSubject ts = new TeacherSubject();
                ts.setTeacher(updatedTeacher);
                ts.setSubject(subject);
                teacherSubjectRepo.save(ts);
            } else {
                TeacherSubject ts = tsList.get(0);
                ts.setSubject(subject);
                teacherSubjectRepo.save(ts);
            }
        } else {
            // Si subjectId = 0, eliminamos relaciones
            List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(id);
            teacherSubjectRepo.deleteAll(tsList);
        }

        dto.setTeacherId(updatedTeacher.getId());
        return dto;
    }

    public void delete(int id) {
        // Verificar si el profesor tiene horarios asignados
        List<schedule> schedules = scheduleRepo.findByTeacherId(id);
        if (!schedules.isEmpty()) {
            throw new IllegalStateException("No se puede eliminar el docente porque tiene horarios asignados");
        }

        // Eliminar disponibilidad del profesor
        List<TeacherAvailability> availabilities = availabilityRepo.findByTeacher_Id(id);
        availabilityRepo.deleteAll(availabilities);

        // Eliminar relaciones TeacherSubject
        List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(id);
        teacherSubjectRepo.deleteAll(tsList);

        // Finalmente eliminar el profesor
        teacherRepo.deleteById(id);
    }

    /**
     * Lista docentes que imparten una materia por nombre.
     */
    public List<TeacherDTO> getTeachersBySubjectName(String subjectName) {
        subjects subject = subjectRepo.findBySubjectName(subjectName);
        if (subject == null) return List.of();

        return teacherSubjectRepo.findBySubject_Id(subject.getId())
                .stream()
                .map(ts -> {
                    TeacherDTO dto = new TeacherDTO();
                    dto.setTeacherId(ts.getTeacher().getId());
                    dto.setTeacherName(ts.getTeacher().getTeacherName());
                    dto.setSubjectId(ts.getSubject().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public TeacherDTO createWithSpecializations(TeacherDTO dto) {
        // Crear el docente
        TeacherDTO createdTeacher = create(dto);

        return createdTeacher;
    }

}