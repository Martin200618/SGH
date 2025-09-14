package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.TeacherDTO;
import com.horarios.SGH.DTO.responseDTO;
import com.horarios.SGH.Service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService service;

    @PostMapping
    public ResponseEntity<responseDTO> create(@Valid @RequestBody TeacherDTO dto) {
        try {
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
    public ResponseEntity<responseDTO> getById(@PathVariable int id) {
        if (id <= 0) {
            return ResponseEntity.badRequest().body(new responseDTO("ERROR", "ID inválido"));
        }
        try {
            TeacherDTO teacher = service.getById(id);
            if (teacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new responseDTO("ERROR", "Docente no encontrado"));
            }
            return ResponseEntity.ok(new responseDTO("OK", "Docente encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new responseDTO("ERROR", "Docente no encontrado"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<responseDTO> update(@PathVariable int id, @Valid @RequestBody TeacherDTO dto) {
        try {
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