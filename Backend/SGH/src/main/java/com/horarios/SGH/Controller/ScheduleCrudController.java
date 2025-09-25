package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.ScheduleDTO;
import com.horarios.SGH.DTO.responseDTO;
import com.horarios.SGH.Service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedules-crud")
@RequiredArgsConstructor
@Tag(name = "Horarios CRUD", description = "Operaciones CRUD para gestión manual de horarios")
public class ScheduleCrudController {

    private final ScheduleService scheduleService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    @Operation(
        summary = "Crear horarios manualmente",
        description = "Permite crear horarios específicos asignando profesores y materias a cursos. " +
                      "Los campos teacherId y subjectId son OBLIGATORIOS. " +
                      "La combinación teacherId + subjectId debe existir en TeacherSubject. " +
                      "Un curso puede tener múltiples profesores en diferentes horarios, pero cada profesor " +
                      "debe estar asociado únicamente a una materia. " +
                      "Las horas se envían como strings en formato 'HH:mm'."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Horarios creados exitosamente"),
        @ApiResponse(responseCode = "400", description = "Error de validación (profesor no disponible, conflicto de horario, etc.)"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public List<ScheduleDTO> createSchedule(
            @Parameter(description = "Lista de horarios a crear", required = true,
                       example = "[{\"courseId\": 12, \"teacherId\": 14, \"subjectId\": 8, \"day\": \"Lunes\", \"startTime\": \"06:06\", \"endTime\": \"07:00\", \"scheduleName\": \"Matemáticas - Juan Pérez\"}]")
            @RequestBody List<ScheduleDTO> assignments,
            Authentication auth) {
        return scheduleService.createSchedule(assignments, auth.getName());
    }

    @GetMapping("/{name}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    @Operation(
        summary = "Obtener horarios por nombre",
        description = "Busca horarios por el nombre del scheduleName"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Horarios encontrados"),
        @ApiResponse(responseCode = "403", description = "No autorizado")
    })
    public List<ScheduleDTO> getByName(
            @Parameter(description = "Nombre del horario a buscar", example = "Matemáticas")
            @PathVariable String name) {
        return scheduleService.getByName(name);
    }

    @GetMapping("/by-course/{id}")
    @Operation(
        summary = "Obtener horarios de un curso",
        description = "Obtiene todos los horarios asignados a un curso específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Horarios del curso obtenidos"),
        @ApiResponse(responseCode = "404", description = "Curso no encontrado")
    })
    public List<ScheduleDTO> getByCourse(
            @Parameter(description = "ID del curso", example = "1")
            @PathVariable Integer id) {
        return scheduleService.getByCourse(id);
    }

    @GetMapping("/by-teacher/{id}")
    @Operation(
        summary = "Obtener horarios de un profesor",
        description = "Obtiene todos los horarios asignados a un profesor específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Horarios del profesor obtenidos"),
        @ApiResponse(responseCode = "404", description = "Profesor no encontrado")
    })
    public List<ScheduleDTO> getByTeacher(
            @Parameter(description = "ID del profesor", example = "5")
            @PathVariable Integer id) {
        return scheduleService.getByTeacher(id);
    }

    @GetMapping
    public List<ScheduleDTO> getAll() {
        return scheduleService.getAll();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    @Operation(
        summary = "Actualizar horario",
        description = "Actualiza un horario específico por su ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Horario actualizado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Error de validación"),
        @ApiResponse(responseCode = "404", description = "Horario no encontrado"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<responseDTO> updateSchedule(
            @PathVariable int id,
            @Valid @RequestBody ScheduleDTO dto,
            BindingResult bindingResult,
            Authentication auth) {
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

            // Validaciones adicionales pueden agregarse aquí si es necesario

            scheduleService.updateSchedule(id, dto, auth.getName());
            return ResponseEntity.ok(new responseDTO("OK", "Horario actualizado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    @Operation(
        summary = "Eliminar horario",
        description = "Elimina un horario específico por su ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Horario eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Horario no encontrado"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<responseDTO> deleteSchedule(
            @PathVariable int id,
            Authentication auth) {
        try {
            scheduleService.deleteSchedule(id, auth.getName());
            return ResponseEntity.ok(new responseDTO("OK", "Horario eliminado correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(new responseDTO("ERROR", "No se puede eliminar el horario porque tiene dependencias"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new responseDTO("ERROR", e.getMessage()));
        }
    }

    @DeleteMapping("/by-day/{day}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    @Operation(
        summary = "Eliminar horarios por día",
        description = "Elimina todos los horarios asignados a un día específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Horarios eliminados exitosamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public void deleteByDay(
            @Parameter(description = "Día a eliminar", example = "Sábado")
            @PathVariable String day) {
        scheduleService.deleteByDay(day);
    }
}