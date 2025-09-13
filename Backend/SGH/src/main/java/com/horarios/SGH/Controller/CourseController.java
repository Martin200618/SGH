package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.ApiResponse;
import com.horarios.SGH.DTO.CourseDTO;
import com.horarios.SGH.Service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService service;

    @PostMapping
    public ApiResponse<?> create(@Valid @RequestBody CourseDTO dto) {
        try {
            CourseDTO createdCourse = service.create(dto);
            return ApiResponse.success("Curso creado exitosamente", createdCourse);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping
    public ApiResponse<?> getAll() {
        try {
            List<CourseDTO> courses = service.getAll();
            return ApiResponse.success("Cursos obtenidos exitosamente", courses);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getById(@PathVariable int id) {
        try {
            CourseDTO course = service.getById(id);
            return ApiResponse.success("Curso encontrado", course);
        } catch (Exception e) {
            return ApiResponse.error("Curso no encontrado");
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<?> update(@PathVariable int id, @Valid @RequestBody CourseDTO dto) {
        try {
            CourseDTO updatedCourse = service.update(id, dto);
            return ApiResponse.success("Curso actualizado exitosamente", updatedCourse);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable int id) {
        try {
            service.delete(id);
            return ApiResponse.success("Curso eliminado exitosamente");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}