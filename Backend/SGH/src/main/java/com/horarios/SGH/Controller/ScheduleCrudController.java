package com.horarios.SGH.Controller;

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
    public List<ScheduleDTO> crearHorario(@RequestBody List<ScheduleDTO> asignaciones,
                                          Authentication auth) {
        return scheduleService.crearHorario(asignaciones, auth.getName());
    }

    @GetMapping("/{name}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    public List<ScheduleDTO> obtenerPorNombre(@PathVariable String name) {
        return scheduleService.obtenerPorNombre(name);
    }

    @GetMapping("/by-course/{id}")
    public List<ScheduleDTO> getByCourse(@PathVariable Integer id) {
        return scheduleService.obtenerPorCurso(id);
    }

    @GetMapping("/by-teacher/{id}")
    public List<ScheduleDTO> getByTeacher(@PathVariable Integer id) {
        return scheduleService.obtenerPorProfesor(id);
    }
}