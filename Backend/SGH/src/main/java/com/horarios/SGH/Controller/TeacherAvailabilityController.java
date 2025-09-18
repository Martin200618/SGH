package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.TeacherAvailabilityDTO;
import com.horarios.SGH.Model.Days;
import com.horarios.SGH.Model.TeacherAvailability;
import com.horarios.SGH.Model.teachers;
import com.horarios.SGH.Repository.ITeacherAvailabilityRepository;
import com.horarios.SGH.Repository.Iteachers;
import com.horarios.SGH.Repository.TeacherSubjectRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/availability")
@RequiredArgsConstructor
public class TeacherAvailabilityController {

    private final ITeacherAvailabilityRepository availabilityRepo;
    private final Iteachers teacherRepo;
    private final TeacherSubjectRepository teacherSubjectRepo;

    @PostMapping("/register")
    public String registerAvailability(@RequestBody TeacherAvailabilityDTO dto) {
        // Validar que el profesor existe
        teachers teacher = teacherRepo.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado con ID: " + dto.getTeacherId()));

        // Validar que no exista ya disponibilidad para este profesor y día
        List<TeacherAvailability> existing = availabilityRepo.findByTeacher_IdAndDay(dto.getTeacherId(), dto.getDay());
        if (!existing.isEmpty()) {
            throw new RuntimeException("Ya existe disponibilidad registrada para este profesor en el día " + dto.getDay());
        }

        // Crear la nueva disponibilidad
        TeacherAvailability availability = new TeacherAvailability();
        availability.setTeacher(teacher);
        availability.setDay(dto.getDay());
        availability.setAmStart(dto.getAmStart());
        availability.setAmEnd(dto.getAmEnd());
        availability.setPmStart(dto.getPmStart());
        availability.setPmEnd(dto.getPmEnd());

        // Validar que al menos tenga un horario válido
        if (!availability.hasValidSchedule()) {
            throw new RuntimeException("Debe proporcionar al menos un horario válido (mañana o tarde)");
        }

        availabilityRepo.save(availability);
        return "Disponibilidad registrada correctamente para " + teacher.getTeacherName() + " el día " + dto.getDay();
    }

    @PutMapping("/update")
    public String updateAvailability(@RequestBody TeacherAvailabilityDTO dto) {
        // Validar que el profesor existe
        teachers teacher = teacherRepo.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado con ID: " + dto.getTeacherId()));

        // Buscar disponibilidad existente
        List<TeacherAvailability> existing = availabilityRepo.findByTeacher_IdAndDay(dto.getTeacherId(), dto.getDay());
        if (existing.isEmpty()) {
            throw new RuntimeException("No existe disponibilidad registrada para este profesor en el día " + dto.getDay());
        }

        // Actualizar la disponibilidad existente
        TeacherAvailability availability = existing.get(0);
        availability.setAmStart(dto.getAmStart());
        availability.setAmEnd(dto.getAmEnd());
        availability.setPmStart(dto.getPmStart());
        availability.setPmEnd(dto.getPmEnd());

        // Validar que al menos tenga un horario válido
        if (!availability.hasValidSchedule()) {
            throw new RuntimeException("Debe proporcionar al menos un horario válido (mañana o tarde)");
        }

        availabilityRepo.save(availability);
        return "Disponibilidad actualizada correctamente para " + teacher.getTeacherName() + " el día " + dto.getDay();
    }

    @GetMapping("/by-teacher/{id}")
    @Operation(
        summary = "Consultar disponibilidad de un profesor",
        description = "Obtiene todos los horarios de disponibilidad de un profesor específico"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de disponibilidades encontradas",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = TeacherAvailability.class)
        )
    )
    public List<TeacherAvailability> getAvailability(@PathVariable Integer id) {
        List<TeacherAvailability> availabilities = availabilityRepo.findByTeacher_Id(id);
        if (availabilities.isEmpty()) {
            throw new RuntimeException("No se encontró disponibilidad para el profesor con ID: " + id);
        }
        return availabilities;
    }

    @GetMapping("/available")
    public List<teachers> getAvailableTeachers(
            @RequestParam String day,
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam Integer subjectId
    ) {
        LocalTime startTime = LocalTime.parse(start);
        LocalTime endTime = LocalTime.parse(end);

        // Filtrar docentes por materia usando TeacherSubject
        List<teachers> all = teacherSubjectRepo.findBySubject_Id(subjectId)
                .stream()
                .map(ts -> ts.getTeacher())
                .distinct()
                .collect(Collectors.toList());

        return all.stream().filter(t -> {
            List<TeacherAvailability> disponibilidad = availabilityRepo.findByTeacher_IdAndDay(t.getId(), Days.valueOf(day));
            return disponibilidad.stream().anyMatch(d -> {
                // Verificar si el horario solicitado está cubierto por AM o PM
                boolean coveredByAM = d.getAmStart() != null && d.getAmEnd() != null &&
                        !startTime.isBefore(d.getAmStart()) && !endTime.isAfter(d.getAmEnd());
                boolean coveredByPM = d.getPmStart() != null && d.getPmEnd() != null &&
                        !startTime.isBefore(d.getPmStart()) && !endTime.isAfter(d.getPmEnd());
                return coveredByAM || coveredByPM;
            });
        }).collect(Collectors.toList());
    }
}