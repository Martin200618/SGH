package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.ScheduleDTO;
import com.horarios.SGH.Model.Days;
import com.horarios.SGH.Model.TeacherAvailability;
import com.horarios.SGH.Model.schedule;
import com.horarios.SGH.Model.courses;
import com.horarios.SGH.Model.subjects;
import com.horarios.SGH.Model.teachers;
import com.horarios.SGH.Model.TeacherSubject;
import com.horarios.SGH.Repository.IScheduleRepository;
import com.horarios.SGH.Repository.ITeacherAvailabilityRepository;
import com.horarios.SGH.Repository.Icourses;
import com.horarios.SGH.Repository.Iteachers;
import com.horarios.SGH.Repository.Isubjects;
import com.horarios.SGH.Repository.TeacherSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService implements IScheduleService {

    private final IScheduleRepository scheduleRepo;
    private final ITeacherAvailabilityRepository availabilityRepo;
    private final Icourses courseRepo;
    private final Iteachers teacherRepo;
    private final Isubjects subjectRepo;
    private final TeacherSubjectRepository teacherSubjectRepo;

    private boolean isTeacherAvailable(Integer teacherId, String day, LocalTime start, LocalTime end) {
        try {
            Days dayEnum = Days.valueOf(day);
            List<TeacherAvailability> disponibilidad = availabilityRepo.findByTeacher_IdAndDay(teacherId, dayEnum);
            return disponibilidad.stream().anyMatch(d -> {
                // Verificar si el horario solicitado está cubierto por AM o PM
                boolean coveredByAM = d.getAmStart() != null && d.getAmEnd() != null &&
                        !start.isBefore(d.getAmStart()) && !end.isAfter(d.getAmEnd());
                boolean coveredByPM = d.getPmStart() != null && d.getPmEnd() != null &&
                        !start.isBefore(d.getPmStart()) && !end.isAfter(d.getPmEnd());
                return coveredByAM || coveredByPM;
            });
        } catch (IllegalArgumentException e) {
            // Día no válido (ej. Sábado o Domingo)
            return false;
        }
    }

    @Transactional
    @Override
    public List<ScheduleDTO> createSchedule(List<ScheduleDTO> assignments, String executedBy) {
        List<schedule> entities = new ArrayList<>();

        for (ScheduleDTO dto : assignments) {
            courses course = courseRepo.findById(dto.getCourseId()).orElseThrow();

            teachers teacher;
            subjects subject;

            // VALIDACIÓN: Si se especifica teacherId, subjectId es obligatorio y viceversa
            if (dto.getTeacherId() != null && dto.getSubjectId() == null) {
                throw new RuntimeException("Si especificas teacherId, también debes especificar subjectId.");
            }
            if (dto.getSubjectId() != null && dto.getTeacherId() == null) {
                throw new RuntimeException("Si especificas subjectId, también debes especificar teacherId.");
            }

            // Si se especifica teacherId y subjectId, usar esos valores
            if (dto.getTeacherId() != null && dto.getSubjectId() != null) {
                teacher = teacherRepo.findById(dto.getTeacherId()).orElseThrow();
                subject = subjectRepo.findById(dto.getSubjectId()).orElseThrow();

                // VALIDACIÓN: Un profesor solo puede estar asociado a UNA materia
                List<TeacherSubject> teacherAssociations = teacherSubjectRepo.findByTeacher_Id(teacher.getId());
                if (teacherAssociations.size() > 1) {
                    throw new RuntimeException("El profesor " + teacher.getTeacherName() +
                        " está asociado a múltiples materias. Cada profesor debe estar asociado únicamente a una materia.");
                }

                // Validar que el profesor esté vinculado específicamente a esta materia
                boolean isLinkedToSubject = teacherSubjectRepo.existsByTeacher_IdAndSubject_Id(teacher.getId(), subject.getId());
                if (!isLinkedToSubject) {
                    throw new RuntimeException("El profesor " + teacher.getTeacherName() +
                        " no está vinculado a la materia " + subject.getSubjectName() +
                        ". Debe existir una relación TeacherSubject entre ellos.");
                }
            } else {
                // Si no se especifica profesor/materia, es un error
                throw new RuntimeException("Debes especificar tanto teacherId como subjectId para crear el horario.");
            }

            if (!isTeacherAvailable(teacher.getId(), dto.getDay(), dto.getStartTimeAsLocalTime(), dto.getEndTimeAsLocalTime())) {
                throw new RuntimeException("El profesor " + teacher.getTeacherName() + " no está disponible el " + dto.getDay());
            }

            schedule s = toEntity(dto);
            s.setCourseId(course);
            entities.add(s);
        }

        scheduleRepo.saveAll(entities);
        return entities.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<ScheduleDTO> getByName(String scheduleName) {
        return scheduleRepo.findByScheduleName(scheduleName)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDTO> getByCourse(Integer courseId) {
        return scheduleRepo.findByCourseId(courseId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDTO> getByTeacher(Integer teacherId) {
        return scheduleRepo.findByTeacherId(teacherId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDTO> getAll() {
        return scheduleRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void deleteByDay(String day) {
        scheduleRepo.deleteByDay(day);
    }

    private schedule toEntity(ScheduleDTO dto) {
        schedule s = new schedule();
        s.setId(dto.getId());
        s.setCourseId(courseRepo.findById(dto.getCourseId()).orElseThrow());
        s.setTeacherId(teacherRepo.findById(dto.getTeacherId()).orElseThrow());
        s.setSubjectId(subjectRepo.findById(dto.getSubjectId()).orElseThrow());
        s.setDay(dto.getDay());
        s.setStartTime(dto.getStartTimeAsLocalTime());
        s.setEndTime(dto.getEndTimeAsLocalTime());
        s.setScheduleName(dto.getScheduleName());
        return s;
    }

    private ScheduleDTO toDTO(schedule s) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(s.getId());
        dto.setCourseId(s.getCourseId().getId());
        dto.setTeacherId(s.getTeacherId().getId());
        dto.setSubjectId(s.getSubjectId().getId());
        dto.setDay(s.getDay());
        dto.setStartTimeFromLocalTime(s.getStartTime());
        dto.setEndTimeFromLocalTime(s.getEndTime());
        dto.setScheduleName(s.getScheduleName());
        dto.setTeacherName(s.getTeacherId().getTeacherName());
        dto.setSubjectName(s.getSubjectId().getSubjectName());

        return dto;
    }
}