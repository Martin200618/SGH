package com.horarios.SGH;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.horarios.SGH.Controller.ScheduleController;
import com.horarios.SGH.DTO.ScheduleHistoryDTO;
import com.horarios.SGH.IService.IScheduleGenerationService;
import com.horarios.SGH.IService.IScheduleHistoryService;
import com.horarios.SGH.Service.ScheduleExportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScheduleController.class)
public class ScheduleControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IScheduleGenerationService generationService;

    @MockBean
    private IScheduleHistoryService historyService;

    @MockBean
    private ScheduleExportService exportService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "testuser", roles = {"COORDINADOR"})
    public void testGenerateSchedule() throws Exception {
        ScheduleHistoryDTO input = new ScheduleHistoryDTO();
        input.setParams("Horario 2025");

        ScheduleHistoryDTO output = new ScheduleHistoryDTO();
        output.setId(1);
        output.setParams("Horario 2025");

        when(generationService.generate(any(ScheduleHistoryDTO.class), any(String.class))).thenReturn(output);

        mockMvc.perform(post("/schedules/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void testGetHistory() throws Exception {
        ScheduleHistoryDTO history = new ScheduleHistoryDTO();
        history.setId(1);

        Page<ScheduleHistoryDTO> page = new PageImpl<>(Arrays.asList(history));

        when(historyService.history(0, 10)).thenReturn(page);

        mockMvc.perform(get("/schedules/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1));
    }

    @Test
    public void testExportPdfByCourse() throws Exception {
        byte[] pdfData = "PDF Content".getBytes();

        when(exportService.exportToPdfByCourse(1)).thenReturn(pdfData);

        mockMvc.perform(get("/schedules/pdf/course/1"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_curso_1.pdf"))
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    public void testExportExcelByTeacher() throws Exception {
        byte[] excelData = "Excel Content".getBytes();

        when(exportService.exportToExcelByTeacher(1)).thenReturn(excelData);

        mockMvc.perform(get("/schedules/excel/teacher/1"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_profesor_1.xlsx"))
                .andExpect(content().contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
    }

    @Test
    public void testExportImageByCourse() throws Exception {
        byte[] imageData = "Image Content".getBytes();

        when(exportService.exportToImageByCourse(1)).thenReturn(imageData);

        mockMvc.perform(get("/schedules/image/course/1"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_curso_1.png"))
                .andExpect(content().contentType(MediaType.IMAGE_PNG));
    }

    @Test
    public void testExportPdfAllSchedules() throws Exception {
        byte[] pdfData = "PDF All Content".getBytes();

        when(exportService.exportToPdfAllSchedules()).thenReturn(pdfData);

        mockMvc.perform(get("/schedules/pdf/all"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_general_completo.pdf"));
    }

    @Test
    public void testExportPdfByTeacher() throws Exception {
        byte[] pdfData = "PDF Teacher Content".getBytes();

        when(exportService.exportToPdfByTeacher(1)).thenReturn(pdfData);

        mockMvc.perform(get("/schedules/pdf/teacher/1"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_profesor_1.pdf"))
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    public void testExportExcelByCourse() throws Exception {
        byte[] excelData = "Excel Course Content".getBytes();

        when(exportService.exportToExcelByCourse(1)).thenReturn(excelData);

        mockMvc.perform(get("/schedules/excel/course/1"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_curso_1.xlsx"))
                .andExpect(content().contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
    }

    @Test
    public void testExportImageByTeacher() throws Exception {
        byte[] imageData = "Image Teacher Content".getBytes();

        when(exportService.exportToImageByTeacher(1)).thenReturn(imageData);

        mockMvc.perform(get("/schedules/image/teacher/1"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_profesor_1.png"))
                .andExpect(content().contentType(MediaType.IMAGE_PNG));
    }

    @Test
    public void testExportPdfAllTeachers() throws Exception {
        byte[] pdfData = "PDF All Teachers Content".getBytes();

        when(exportService.exportToPdfAllTeachersSchedules()).thenReturn(pdfData);

        mockMvc.perform(get("/schedules/pdf/all-teachers"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_profesores_completo.pdf"));
    }

    @Test
    public void testExportExcelAll() throws Exception {
        byte[] excelData = "Excel All Content".getBytes();

        when(exportService.exportToExcelAllSchedules()).thenReturn(excelData);

        mockMvc.perform(get("/schedules/excel/all"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_general_completo.xlsx"));
    }

    @Test
    public void testExportExcelAllTeachers() throws Exception {
        byte[] excelData = "Excel All Teachers Content".getBytes();

        when(exportService.exportToExcelAllTeachersSchedules()).thenReturn(excelData);

        mockMvc.perform(get("/schedules/excel/all-teachers"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_profesores_completo.xlsx"));
    }

    @Test
    public void testExportImageAll() throws Exception {
        byte[] imageData = "Image All Content".getBytes();

        when(exportService.exportToImageAllSchedules()).thenReturn(imageData);

        mockMvc.perform(get("/schedules/image/all"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_general_completo.png"));
    }

    @Test
    public void testExportImageAllTeachers() throws Exception {
        byte[] imageData = "Image All Teachers Content".getBytes();

        when(exportService.exportToImageAllTeachersSchedules()).thenReturn(imageData);

        mockMvc.perform(get("/schedules/image/all-teachers"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=horario_profesores_completo.png"));
    }
}