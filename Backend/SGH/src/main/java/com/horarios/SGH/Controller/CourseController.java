package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.CourseDTO;
import com.horarios.SGH.DTO.responseDTO;
import com.horarios.SGH.Service.CourseService;
import com.horarios.SGH.Service.ValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService service;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CourseDTO dto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Error de validación");
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", errorMessage));
        }

        try {
            ValidationUtils.validateCourseName(dto.getCourseName());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }

        try {
            CourseDTO result = service.create(dto);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }
    }

    @GetMapping
    public List<CourseDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CourseDTO getById(@PathVariable int id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @Valid @RequestBody CourseDTO dto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Error de validación");
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", errorMessage));
        }

        try {
            ValidationUtils.validateCourseName(dto.getCourseName());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }

        try {
            CourseDTO result = service.update(id, dto);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}