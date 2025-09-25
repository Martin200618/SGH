package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.CourseDTO;
import com.horarios.SGH.DTO.responseDTO;
import com.horarios.SGH.Service.CourseService;
import com.horarios.SGH.Service.ValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService service;

    @PostMapping
    public ResponseEntity<responseDTO> create(@Valid @RequestBody CourseDTO dto, BindingResult bindingResult) {
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
            service.create(dto);
            return ResponseEntity.ok(new responseDTO("OK", "Curso creado correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", "Curso ya existente"));
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
    public ResponseEntity<responseDTO> update(@PathVariable int id, @Valid @RequestBody CourseDTO dto, BindingResult bindingResult) {
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
            service.update(id, dto);
            return ResponseEntity.ok(new responseDTO("OK", "Curso actualizado correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", "no puedes colocar el nombre de un curso ya existente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> delete(@PathVariable int id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(new responseDTO("OK", "Curso eliminado correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(new responseDTO("ERROR", "No se puede eliminar el curso porque está asociado a un horario"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new responseDTO("ERROR", "Curso no encontrado"));
        }
    }
}