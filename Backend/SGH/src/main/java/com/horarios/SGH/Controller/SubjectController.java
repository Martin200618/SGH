package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.SubjectDTO;
import com.horarios.SGH.DTO.responseDTO;
import com.horarios.SGH.Service.SubjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubjectController {

    private final SubjectService service;

    // Crear materia
    @PostMapping
    public ResponseEntity<responseDTO> create(@Valid @RequestBody SubjectDTO dto, BindingResult bindingResult) {
        // Validar errores de validación del DTO
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Error de validación");
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", errorMessage));
        }

        // VALIDACIÓN MANUAL ADICIONAL: Verificar que el nombre NO contenga números
        if (dto.getSubjectName() != null && dto.getSubjectName().matches(".*\\d.*")) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", "El nombre de la materia no puede contener números"));
        }

        // VALIDACIÓN MANUAL ADICIONAL: Verificar longitud
        if (dto.getSubjectName() != null) {
            if (dto.getSubjectName().length() < 5) {
                return ResponseEntity.badRequest()
                        .body(new responseDTO("ERROR", "El nombre de la materia debe tener al menos 5 caracteres"));
            }
            if (dto.getSubjectName().length() > 20) {
                return ResponseEntity.badRequest()
                        .body(new responseDTO("ERROR", "El nombre de la materia debe tener máximo 20 caracteres"));
            }
        }

        try {
            service.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new responseDTO("OK", "Materia creada correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", "Materia ya existente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }
    }

    // Obtener todas las materias
    @GetMapping
    public ResponseEntity<List<SubjectDTO>> getAll() {
        List<SubjectDTO> subjects = service.getAll();
        return ResponseEntity.ok(subjects);
    }

    // Obtener materia por ID
    @GetMapping("/{id}")
    public ResponseEntity<responseDTO> getById(@PathVariable int id) {
        if (id <= 0) {
            return ResponseEntity.badRequest().body(new responseDTO("ERROR", "ID inválido o no encontrado"));
        }
        try {
            service.getById(id); // Solo ejecuta, no guarda variable
            return ResponseEntity.ok(new responseDTO("OK", "Materia encontrada"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new responseDTO("ERROR", "Materia no encontrada"));
        }
    }

    // Actualizar materia
    @PutMapping("/{id}")
    public ResponseEntity<responseDTO> update(@PathVariable int id, @Valid @RequestBody SubjectDTO dto, BindingResult bindingResult) {
        // Validar errores de validación del DTO
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Error de validación");
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", errorMessage));
        }

        // VALIDACIÓN MANUAL ADICIONAL: Verificar que el nombre NO contenga números
        if (dto.getSubjectName() != null && dto.getSubjectName().matches(".*\\d.*")) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", "El nombre de la materia no puede contener números"));
        }

        // VALIDACIÓN MANUAL ADICIONAL: Verificar longitud
        if (dto.getSubjectName() != null) {
            if (dto.getSubjectName().length() < 5) {
                return ResponseEntity.badRequest()
                        .body(new responseDTO("ERROR", "El nombre de la materia debe tener al menos 5 caracteres"));
            }
            if (dto.getSubjectName().length() > 20) {
                return ResponseEntity.badRequest()
                        .body(new responseDTO("ERROR", "El nombre de la materia debe tener máximo 20 caracteres"));
            }
        }

        try {
            service.update(id, dto);
            return ResponseEntity.ok(new responseDTO("OK", "Materia actualizada correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", "No pudes colocar el nombre de una materia ya existente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }
    }

    // Eliminar materia
    @DeleteMapping("/{id}")
    public ResponseEntity<responseDTO> delete(@PathVariable int id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(new responseDTO("OK", "Materia eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new responseDTO("ERROR", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new responseDTO("ERROR", "Materia no encontrada"));
        }
    }

}