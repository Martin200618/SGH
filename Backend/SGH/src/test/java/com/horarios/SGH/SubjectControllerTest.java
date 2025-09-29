package com.horarios.SGH;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.horarios.SGH.Controller.SubjectController;
import com.horarios.SGH.DTO.SubjectDTO;
import com.horarios.SGH.Service.SubjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SubjectController.class)
public class SubjectControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubjectService subjectService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateSubjectSuccess() throws Exception {
        SubjectDTO input = new SubjectDTO();
        input.setSubjectName("Matematicas");

        when(subjectService.create(any(SubjectDTO.class))).thenReturn(null); // Service returns void

        mockMvc.perform(post("/subjects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Materia creada correctamente"));
    }

    @Test
    public void testCreateSubjectFailure() throws Exception {
        SubjectDTO input = new SubjectDTO();
        input.setSubjectName(""); // Invalid

        when(subjectService.create(any(SubjectDTO.class)))
                .thenThrow(new RuntimeException("Validation error"));

        mockMvc.perform(post("/subjects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testGetAllSubjects() throws Exception {
        SubjectDTO subject1 = new SubjectDTO();
        subject1.setSubjectId(1);
        subject1.setSubjectName("Matemáticas");

        SubjectDTO subject2 = new SubjectDTO();
        subject2.setSubjectId(2);
        subject2.setSubjectName("Física");

        List<SubjectDTO> subjects = Arrays.asList(subject1, subject2);

        when(subjectService.getAll()).thenReturn(subjects);

        mockMvc.perform(get("/subjects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testGetSubjectByIdSuccess() throws Exception {
        when(subjectService.getById(1)).thenReturn(null); // Assuming service returns something

        mockMvc.perform(get("/subjects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Materia encontrada"));
    }

    @Test
    public void testGetSubjectByIdNotFound() throws Exception {
        when(subjectService.getById(1)).thenThrow(new RuntimeException("Not found"));

        mockMvc.perform(get("/subjects/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Materia no encontrada"));
    }

    @Test
    public void testUpdateSubjectSuccess() throws Exception {
        SubjectDTO input = new SubjectDTO();
        input.setSubjectName("Matemáticas");

        when(subjectService.update(eq(1), any(SubjectDTO.class))).thenReturn(null);

        mockMvc.perform(put("/subjects/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Materia actualizada correctamente"));
    }

    @Test
    public void testDeleteSubjectSuccess() throws Exception {
        doNothing().when(subjectService).delete(1);

        mockMvc.perform(delete("/subjects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Materia eliminada correctamente"));
    }
}