package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.TeacherAvailabilityDTO;
import com.horarios.SGH.Model.Days;
import com.horarios.SGH.Model.TeacherAvailability;
import com.horarios.SGH.Model.teachers;
import com.horarios.SGH.Repository.ITeacherAvailabilityRepository;
import com.horarios.SGH.Repository.Iteachers;
import com.horarios.SGH.Repository.TeacherSubjectRepository;
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
        teachers teacher = teacherRepo.findById(dto.getTeacherId()).orElseThrow();

        TeacherAvailability availability = new TeacherAvailability();
        availability.setTeacher(teacher);
        availability.setDay(dto.getDay());
        availability.setAmStart(dto.getAmStart());
        availability.setAmEnd(dto.getAmEnd());
        availability.setPmStart(dto.getPmStart());
        availability.setPmEnd(dto.getPmEnd());

        availabilityRepo.save(availability);
        return "Disponibilidad registrada correctamente";
    }

    @GetMapping("/by-teacher/{id}")
    public List<TeacherAvailability> getAvailability(@PathVariable Integer id) {
        return availabilityRepo.findByTeacher_Id(id);
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