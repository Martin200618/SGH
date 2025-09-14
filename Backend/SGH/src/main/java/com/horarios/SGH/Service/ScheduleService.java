package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.ScheduleDTO;
import com.horarios.SGH.Model.Days;
import com.horarios.SGH.Model.TeacherAvailability;
import com.horarios.SGH.Model.schedule;
import com.horarios.SGH.Model.courses;
import com.horarios.SGH.Model.teachers;
import com.horarios.SGH.Repository.IScheduleRepository;
import com.horarios.SGH.Repository.ITeacherAvailabilityRepository;
import com.horarios.SGH.Repository.Icourses;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final IScheduleRepository scheduleRepo;
    private final ITeacherAvailabilityRepository availabilityRepo;
    private final Icourses courseRepo;

    private boolean isTeacherAvailable(Integer teacherId, String day, LocalTime start, LocalTime end) {
        List<TeacherAvailability> disponibilidad = availabilityRepo.findByTeacher_IdAndDay(teacherId, Days.valueOf(day));
        return disponibilidad.stream().anyMatch(d ->
                !start.isBefore(d.getStartTime()) && !end.isAfter(d.getEndTime())
        );
    }

    @Transactional
    public List<ScheduleDTO> crearHorario(List<ScheduleDTO> asignaciones, String executedBy) {
        List<schedule> entities = new ArrayList<>();

        for (ScheduleDTO dto : asignaciones) {
            courses course = courseRepo.findById(dto.getCourseId()).orElseThrow();
            if (course.getTeacherSubject() == null) {
                throw new RuntimeException("El curso no tiene docente/materia asignados.");
            }
            teachers teacher = course.getTeacherSubject().getTeacher();

            if (!isTeacherAvailable(teacher.getId(), dto.getDay(), dto.getStartTime(), dto.getEndTime())) {
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
    public List<ScheduleDTO> obtenerPorNombre(String scheduleName) {
        return scheduleRepo.findByScheduleName(scheduleName)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ScheduleDTO> obtenerPorCurso(Integer courseId) {
        return scheduleRepo.findByCourseId(courseId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ScheduleDTO> obtenerPorProfesor(Integer teacherId) {
        return scheduleRepo.findByTeacherId(teacherId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    private schedule toEntity(ScheduleDTO dto) {
        schedule s = new schedule();
        s.setId(dto.getId());
        s.setCourseId(courseRepo.findById(dto.getCourseId()).orElseThrow());
        s.setDay(dto.getDay());
        s.setStartTime(dto.getStartTime());
        s.setEndTime(dto.getEndTime());
        s.setScheduleName(dto.getScheduleName());
        return s;
    }

    private ScheduleDTO toDTO(schedule s) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(s.getId());
        dto.setCourseId(s.getCourseId().getId());
        dto.setDay(s.getDay());
        dto.setStartTime(s.getStartTime());
        dto.setEndTime(s.getEndTime());
        dto.setScheduleName(s.getScheduleName());

        if (s.getCourseId().getTeacherSubject() != null) {
            dto.setTeacherName(s.getCourseId().getTeacherSubject().getTeacher().getTeacherName());
            dto.setSubjectName(s.getCourseId().getTeacherSubject().getSubject().getSubjectName());
        }
        return dto;
    }
}