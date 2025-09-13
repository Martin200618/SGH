package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.ApiResponse;
import com.horarios.SGH.DTO.ScheduleDTO;
import com.horarios.SGH.Service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedules-crud")
@RequiredArgsConstructor
public class ScheduleCrudController {

    private final ScheduleService scheduleService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    public ApiResponse<?> crearHorario(@RequestBody List<ScheduleDTO> asignaciones,
                                                      Authentication auth) {
        try {
            List<ScheduleDTO> horario = scheduleService.crearHorario(asignaciones, auth.getName());
            return ApiResponse.success("Horario creado exitosamente", horario);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/{name}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    public ApiResponse<?> obtenerPorNombre(@PathVariable String name) {
        try {
            List<ScheduleDTO> horarios = scheduleService.obtenerPorNombre(name);
            return ApiResponse.success("Horarios obtenidos exitosamente", horarios);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/by-course/{id}")
    public ApiResponse<?> getByCourse(@PathVariable Integer id) {
        try {
            List<ScheduleDTO> horarios = scheduleService.obtenerPorCurso(id);
            return ApiResponse.success("Horarios por curso obtenidos exitosamente", horarios);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/by-teacher/{id}")
    public ApiResponse<?> getByTeacher(@PathVariable Integer id) {
        try {
            List<ScheduleDTO> horarios = scheduleService.obtenerPorProfesor(id);
            return ApiResponse.success("Horarios por profesor obtenidos exitosamente", horarios);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}