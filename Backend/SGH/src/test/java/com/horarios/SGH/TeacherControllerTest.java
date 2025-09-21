package com.horarios.SGH;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.horarios.SGH.Controller.TeacherController;
import com.horarios.SGH.DTO.TeacherDTO;
import com.horarios.SGH.Model.subjects;
import com.horarios.SGH.Repository.Isubjects;
import com.horarios.SGH.Service.TeacherService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TeacherController.class)
public class TeacherControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private Isubjects isubjects;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateTeacherSuccess() throws Exception {
        TeacherDTO input = new TeacherDTO();
        input.setTeacherName("Juan Pérez");
        input.setSubjectId(1);

        subjects subject = new subjects();
        subject.setId(1);

        when(isubjects.findById(1)).thenReturn(Optional.of(subject));
        when(teacherService.create(any(TeacherDTO.class))).thenReturn(null);

        mockMvc.perform(post("/teachers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Docente creado correctamente"));
    }

    @Test
    public void testCreateTeacherValidationError() throws Exception {
        TeacherDTO input = new TeacherDTO();
        input.setTeacherName(""); // Invalid

        when(teacherService.create(any(TeacherDTO.class)))
                .thenThrow(new RuntimeException("Validation error"));

        mockMvc.perform(post("/teachers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testCreateTeacherSubjectNotFound() throws Exception {
        TeacherDTO input = new TeacherDTO();
        input.setTeacherName("Juan Pérez");
        input.setSubjectId(1);

        when(isubjects.findById(1)).thenReturn(Optional.empty());

        mockMvc.perform(post("/teachers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("La materia con ID 1 no existe"));
    }

    @Test
    public void testGetAllTeachers() throws Exception {
        TeacherDTO teacher1 = new TeacherDTO();
        teacher1.setTeacherId(1);
        teacher1.setTeacherName("Juan Pérez");

        List<TeacherDTO> teachers = Arrays.asList(teacher1);

        when(teacherService.getAll()).thenReturn(teachers);

        mockMvc.perform(get("/teachers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    public void testGetTeacherByIdSuccess() throws Exception {
        TeacherDTO teacher = new TeacherDTO();
        teacher.setTeacherId(1);
        teacher.setTeacherName("Juan Pérez");

        when(teacherService.getById(1)).thenReturn(teacher);

        mockMvc.perform(get("/teachers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.teacherId").value(1));
    }

    @Test
    public void testGetTeacherByIdNotFound() throws Exception {
        when(teacherService.getById(1)).thenReturn(null);

        mockMvc.perform(get("/teachers/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateTeacherSuccess() throws Exception {
        TeacherDTO input = new TeacherDTO();
        input.setTeacherName("Juan Pérez Actualizado");
        input.setSubjectId(1);

        subjects subject = new subjects();
        subject.setId(1);

        when(isubjects.findById(1)).thenReturn(Optional.of(subject));
        when(teacherService.update(eq(1), any(TeacherDTO.class))).thenReturn(null);

        mockMvc.perform(put("/teachers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Docente actualizado correctamente"));
    }

    @Test
    public void testDeleteTeacherSuccess() throws Exception {
        doNothing().when(teacherService).delete(1);

        mockMvc.perform(delete("/teachers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Docente eliminado correctamente"));
    }
}