package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.ApiResponse;
import com.horarios.SGH.DTO.TeacherDTO;
import com.horarios.SGH.Service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService service;

    @PostMapping
    public ApiResponse<?> create(@Valid @RequestBody TeacherDTO dto) {
        try {
            TeacherDTO createdTeacher = service.create(dto);
            return ApiResponse.success("Docente creado exitosamente", createdTeacher);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping
    public ApiResponse<?> getAll() {
        try {
            List<TeacherDTO> teachers = service.getAll();
            return ApiResponse.success("Docentes obtenidos exitosamente", teachers);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getById(@PathVariable int id) {
        try {
            TeacherDTO teacher = service.getById(id);
            return ApiResponse.success("Docente encontrado", teacher);
        } catch (Exception e) {
            return ApiResponse.error("Docente no encontrado");
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<?> update(@PathVariable int id, @Valid @RequestBody TeacherDTO dto) {
        try {
            TeacherDTO updatedTeacher = service.update(id, dto);
            return ApiResponse.success("Docente actualizado exitosamente", updatedTeacher);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable int id) {
        try {
            service.delete(id);
            return ApiResponse.success("Docente eliminado exitosamente");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}