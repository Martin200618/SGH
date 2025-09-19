package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.TeacherDTO;
import com.horarios.SGH.DTO.responseDTO;
import com.horarios.SGH.Model.subjects;
import com.horarios.SGH.Repository.Isubjects;
import com.horarios.SGH.Service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService service;
    private final Isubjects Isubjects;

    @PostMapping
    public ResponseEntity<responseDTO> create(@Valid @RequestBody TeacherDTO dto, BindingResult bindingResult) {
        try {
            // Validar errores de validación del DTO
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getDefaultMessage())
                        .findFirst()
                        .orElse("Error de validación");
                return ResponseEntity.badRequest()
                        .body(new responseDTO("ERROR", errorMessage));
            }

            // Verificar que la materia existe
            Optional<subjects> subject = Isubjects.findById(dto.getSubjectId());
            if (subject.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new responseDTO("ERROR", "La materia con ID " + dto.getSubjectId() + " no existe"));
            }
            
            service.create(dto);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new responseDTO("OK", "Docente creado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<TeacherDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDTO> getById(@PathVariable int id) {
        if (id <= 0) {
            return ResponseEntity.badRequest().body(null);
        }
        try {
            TeacherDTO teacher = service.getById(id);
            if (teacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(teacher);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<responseDTO> update(@PathVariable int id, @Valid @RequestBody TeacherDTO dto, BindingResult bindingResult) {
        try {
            // Validar errores de validación del DTO
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getDefaultMessage())
                        .findFirst()
                        .orElse("Error de validación");
                return ResponseEntity.badRequest()
                        .body(new responseDTO("ERROR", errorMessage));
            }

            // Verificar que la materia existe
            Optional<subjects> subject = Isubjects.findById(dto.getSubjectId());
            if (subject.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new responseDTO("ERROR", "La materia con ID " + dto.getSubjectId() + " no existe"));
            }
            
            service.update(id, dto);
            return ResponseEntity.ok(new responseDTO("OK", "Docente actualizado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> delete(@PathVariable int id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(new responseDTO("OK", "Docente eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(new responseDTO("ERROR", "No se pudo eliminar el docente"));
        }
    }
}