package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.ApiResponse;
import com.horarios.SGH.DTO.TeacherAvailabilityDTO;
import com.horarios.SGH.Model.TeacherAvailability;
import com.horarios.SGH.Repository.ITeacherAvailabilityRepository;
import com.horarios.SGH.Repository.Iteachers;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/availability")
@RequiredArgsConstructor
public class TeacherAvailabilityController {

    private final ITeacherAvailabilityRepository availabilityRepo;
    private final Iteachers teacherRepo;

    @PostMapping("/register")
    public ApiResponse<?> registerAvailability(@Valid @RequestBody TeacherAvailabilityDTO dto) {
        try {
            var teacher = teacherRepo.findById(dto.getTeacherId())
                    .orElseThrow(() -> new NoSuchElementException("Profesor no encontrado"));

            TeacherAvailability availability = new TeacherAvailability();
            availability.setTeacher(teacher);
            availability.setDay(dto.getDay());
            availability.setStartTime(dto.getStartTime());
            availability.setEndTime(dto.getEndTime());

            availabilityRepo.save(availability);
            return ApiResponse.success("Disponibilidad registrada exitosamente");
        } catch (NoSuchElementException ex) {
            return ApiResponse.error(ex.getMessage());
        } catch (Exception ex) {
            return ApiResponse.error("Error al registrar disponibilidad");
        }
    }

    @GetMapping("/by-teacher/{id}")
    public ApiResponse<?> getAvailability(@PathVariable Integer id) {
        try {
            List<TeacherAvailability> availability = availabilityRepo.findByTeacher_Id(id);
            return ApiResponse.success("Disponibilidad obtenida exitosamente", availability);
        } catch (Exception ex) {
            return ApiResponse.error("Error al obtener disponibilidad");
        }
    }
}