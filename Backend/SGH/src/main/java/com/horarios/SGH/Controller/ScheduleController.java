package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.ScheduleHistoryDTO;
import com.horarios.SGH.Service.ScheduleGenerationService;
import com.horarios.SGH.Service.ScheduleExportService;
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
public class ScheduleController {

    private final ScheduleGenerationService generationService;
    private final ScheduleExportService exportService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    public ScheduleHistoryDTO generate(
            @RequestBody ScheduleHistoryDTO request,
            Authentication auth
    ) {
        return generationService.generate(request, auth.getName());
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINADOR')")
    public Page<ScheduleHistoryDTO> history(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return generationService.history(page, size);
    }
    
    // PDF por curso
    @GetMapping("/pdf/course/{id}")
    public ResponseEntity<byte[]> exportPdfByCourse(@PathVariable Integer id) throws Exception {
        byte[] pdf = exportService.exportToPdfByCourse(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_curso_" + id + ".pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }

    // PDF por profesor
    @GetMapping("/pdf/teacher/{id}")
    public ResponseEntity<byte[]> exportPdfByTeacher(@PathVariable Integer id) throws Exception {
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
}