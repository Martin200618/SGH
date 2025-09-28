package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.ScheduleHistoryDTO;
import com.horarios.SGH.IService.IScheduleGenerationService;
import com.horarios.SGH.IService.IScheduleHistoryService;
import com.horarios.SGH.Service.ScheduleExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
@Tag(name = "Horarios", description = "Gestión de generación y exportación de horarios")
public class ScheduleController {

    private final IScheduleGenerationService generationService;
    private final IScheduleHistoryService historyService;
    private final ScheduleExportService exportService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    @Operation(
        summary = "Generar horarios automáticamente por cursos",
        description = "Genera horarios automáticamente para cursos que no tienen horario asignado. " +
                     "Utiliza únicamente el profesor asignado a cada curso y valida que cada profesor " +
                     "esté asociado a una sola materia."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Horarios generados exitosamente"),
        @ApiResponse(responseCode = "400", description = "Error en parámetros o configuración de profesores"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ScheduleHistoryDTO generate(
            @Parameter(description = "Parámetros de generación de horarios", required = true)
            @RequestBody ScheduleHistoryDTO request,
            Authentication auth
    ) {
        return generationService.generate(request, auth.getName());
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    @Operation(
        summary = "Obtener historial de generaciones",
        description = "Consulta el historial de todas las generaciones de horarios realizadas en el sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Historial obtenido exitosamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado")
    })
    public Page<ScheduleHistoryDTO> history(
            @Parameter(description = "Número de página (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        return historyService.history(page, size);
    }
    
    // PDF por curso
    @GetMapping("/pdf/course/{id}")
    @Operation(
        summary = "Exportar PDF de un curso",
        description = "Genera un PDF con todos los horarios de un curso específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "PDF generado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Curso no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error al generar el PDF")
    })
    public ResponseEntity<byte[]> exportPdfByCourse(
            @Parameter(description = "ID del curso", example = "1")
            @PathVariable Integer id) throws Exception {
        byte[] pdf = exportService.exportToPdfByCourse(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_curso_" + id + ".pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }

    // PDF por profesor
    @GetMapping("/pdf/teacher/{id}")
    @Operation(
        summary = "Exportar PDF de un profesor",
        description = "Genera un PDF con todos los horarios de un profesor específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "PDF generado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Profesor no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error al generar el PDF")
    })
    public ResponseEntity<byte[]> exportPdfByTeacher(
            @Parameter(description = "ID del profesor", example = "5")
            @PathVariable Integer id) throws Exception {
        byte[] pdf = exportService.exportToPdfByTeacher(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_profesor_" + id + ".pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }

    // Excel por curso
    @GetMapping("/excel/course/{id}")
    public ResponseEntity<byte[]> exportExcelByCourse(@PathVariable Integer id) throws Exception {
        byte[] excel = exportService.exportToExcelByCourse(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_curso_" + id + ".xlsx")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(excel);
    }

    // Excel por profesor
    @GetMapping("/excel/teacher/{id}")
    public ResponseEntity<byte[]> exportExcelByTeacher(@PathVariable Integer id) throws Exception {
        byte[] excel = exportService.exportToExcelByTeacher(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_profesor_" + id + ".xlsx")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(excel);
    }

    // Imagen por curso
    @GetMapping("/image/course/{id}")
    public ResponseEntity<byte[]> exportImageByCourse(@PathVariable Integer id) throws Exception {
        byte[] image = exportService.exportToImageByCourse(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_curso_" + id + ".png")
            .contentType(MediaType.IMAGE_PNG)
            .body(image);
    }

    // Imagen por profesor
    @GetMapping("/image/teacher/{id}")
    public ResponseEntity<byte[]> exportImageByTeacher(@PathVariable Integer id) throws Exception {
        byte[] image = exportService.exportToImageByTeacher(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_profesor_" + id + ".png")
            .contentType(MediaType.IMAGE_PNG)
            .body(image);
    }

    // PDF con todos los horarios de todos los cursos
    @GetMapping("/pdf/all")
    @Operation(
        summary = "Exportar PDF general por cursos",
        description = "Genera un PDF con todos los horarios organizados por cursos"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "PDF generado exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error al generar el PDF")
    })
    public ResponseEntity<byte[]> exportPdfAllSchedules() throws Exception {
        byte[] pdf = exportService.exportToPdfAllSchedules();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_general_completo.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }

    // PDF con todos los horarios organizados por profesores
    @GetMapping("/pdf/all-teachers")
    @Operation(
        summary = "Exportar PDF general por profesores",
        description = "Genera un PDF con todos los horarios organizados por profesores"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "PDF generado exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error al generar el PDF")
    })
    public ResponseEntity<byte[]> exportPdfAllTeachersSchedules() throws Exception {
        byte[] pdf = exportService.exportToPdfAllTeachersSchedules();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_profesores_completo.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }

    // Excel con todos los horarios de todos los cursos
    @GetMapping("/excel/all")
    @Operation(
        summary = "Exportar Excel general por cursos",
        description = "Genera un archivo Excel con todos los horarios organizados por cursos"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Excel generado exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error al generar el Excel")
    })
    public ResponseEntity<byte[]> exportExcelAllSchedules() throws Exception {
        byte[] excel = exportService.exportToExcelAllSchedules();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_general_completo.xlsx")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(excel);
    }

    // Excel con todos los horarios organizados por profesores
    @GetMapping("/excel/all-teachers")
    @Operation(
        summary = "Exportar Excel general por profesores",
        description = "Genera un archivo Excel con todos los horarios organizados por profesores"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Excel generado exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error al generar el Excel")
    })
    public ResponseEntity<byte[]> exportExcelAllTeachersSchedules() throws Exception {
        byte[] excel = exportService.exportToExcelAllTeachersSchedules();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_profesores_completo.xlsx")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(excel);
    }

    // Imagen con todos los horarios de todos los cursos
    @GetMapping("/image/all")
    @Operation(
        summary = "Exportar imagen general por cursos",
        description = "Genera una imagen PNG con todos los horarios organizados por cursos"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imagen generada exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error al generar la imagen")
    })
    public ResponseEntity<byte[]> exportImageAllSchedules() throws Exception {
        byte[] image = exportService.exportToImageAllSchedules();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_general_completo.png")
            .contentType(MediaType.IMAGE_PNG)
            .body(image);
    }

    // Imagen con todos los horarios organizados por profesores
    @GetMapping("/image/all-teachers")
    @Operation(
        summary = "Exportar imagen general por profesores",
        description = "Genera una imagen PNG con todos los horarios organizados por profesores"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imagen generada exitosamente"),
        @ApiResponse(responseCode = "500", description = "Error al generar la imagen")
    })
    public ResponseEntity<byte[]> exportImageAllTeachersSchedules() throws Exception {
        byte[] image = exportService.exportToImageAllTeachersSchedules();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_profesores_completo.png")
            .contentType(MediaType.IMAGE_PNG)
            .body(image);
    }
}