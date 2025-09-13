package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.ApiResponse;
import com.horarios.SGH.DTO.SubjectDTO;
import com.horarios.SGH.Service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService service;

    @PostMapping
    public ApiResponse<?> create(@Valid @RequestBody SubjectDTO dto) {
        try {
            SubjectDTO createdSubject = service.create(dto);
            return ApiResponse.success("Materia creada exitosamente", createdSubject);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping
    public ApiResponse<?> getAll() {
        try {
            List<SubjectDTO> subjects = service.getAll();
            return ApiResponse.success("Materias obtenidas exitosamente", subjects);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getById(@PathVariable int id) {
        try {
            SubjectDTO subject = service.getById(id);
            return ApiResponse.success("Materia encontrada", subject);
        } catch (Exception e) {
            return ApiResponse.error("Materia no encontrada");
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<?> update(@PathVariable int id, @Valid @RequestBody SubjectDTO dto) {
        try {
            SubjectDTO updatedSubject = service.update(id, dto);
            return ApiResponse.success("Materia actualizada exitosamente", updatedSubject);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable int id) {
        try {
            service.delete(id);
            return ApiResponse.success("Materia eliminada exitosamente");
        } catch (Exception e) {
            return ApiResponse.error("Materia no encontrada");
        }
    }
}