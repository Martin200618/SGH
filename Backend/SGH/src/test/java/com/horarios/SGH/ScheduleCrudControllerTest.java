package com.horarios.SGH;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.horarios.SGH.Controller.ScheduleCrudController;
import com.horarios.SGH.DTO.ScheduleDTO;
import com.horarios.SGH.DTO.responseDTO;
import com.horarios.SGH.Service.ScheduleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.validation.BindingResult;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScheduleCrudController.class)
public class ScheduleCrudControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ScheduleService scheduleService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testCreateSchedule() throws Exception {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setCourseId(1);
        dto.setTeacherId(2);
        dto.setSubjectId(3);
        dto.setDay("Lunes");
        dto.setStartTime("08:00");
        dto.setEndTime("09:00");
        dto.setScheduleName("Test Schedule");

        List<ScheduleDTO> input = Arrays.asList(dto);
        List<ScheduleDTO> output = Arrays.asList(dto);

        when(scheduleService.createSchedule(anyList(), anyString())).thenReturn(output);

        mockMvc.perform(post("/schedules-crud")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].courseId").value(1));
    }

    @Test
    @WithMockUser(username = "coordinador", roles = {"COORDINADOR"})
    public void testGetByName() throws Exception {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setScheduleName("Test");

        List<ScheduleDTO> result = Arrays.asList(dto);

        when(scheduleService.getByName("Test")).thenReturn(result);

        mockMvc.perform(get("/schedules-crud/Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].scheduleName").value("Test"));
    }

    @Test
    public void testGetByCourse() throws Exception {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setCourseId(1);

        List<ScheduleDTO> result = Arrays.asList(dto);

        when(scheduleService.getByCourse(1)).thenReturn(result);

        mockMvc.perform(get("/schedules-crud/by-course/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].courseId").value(1));
    }

    @Test
    public void testGetByTeacher() throws Exception {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setTeacherId(2);

        List<ScheduleDTO> result = Arrays.asList(dto);

        when(scheduleService.getByTeacher(2)).thenReturn(result);

        mockMvc.perform(get("/schedules-crud/by-teacher/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].teacherId").value(2));
    }

    @Test
    public void testGetAll() throws Exception {
        ScheduleDTO dto = new ScheduleDTO();

        List<ScheduleDTO> result = Arrays.asList(dto);

        when(scheduleService.getAll()).thenReturn(result);

        mockMvc.perform(get("/schedules-crud"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testUpdateSchedule() throws Exception {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(1);
        dto.setScheduleName("Updated");

        ScheduleDTO updated = new ScheduleDTO();
        updated.setId(1);
        updated.setScheduleName("Updated");

        when(scheduleService.updateSchedule(anyInt(), any(ScheduleDTO.class), anyString())).thenReturn(updated);

        mockMvc.perform(put("/schedules-crud/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OK"))
                .andExpect(jsonPath("$.message").value("Horario actualizado correctamente"));
    }

    @Test
    @WithMockUser(username = "coordinador", roles = {"COORDINADOR"})
    public void testDeleteSchedule() throws Exception {
        doNothing().when(scheduleService).deleteSchedule(anyInt(), anyString());

        mockMvc.perform(delete("/schedules-crud/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OK"))
                .andExpect(jsonPath("$.message").value("Horario eliminado correctamente"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testDeleteByDay() throws Exception {
        doNothing().when(scheduleService).deleteByDay(anyString());

        mockMvc.perform(delete("/schedules-crud/by-day/Lunes"))
                .andExpect(status().isOk());
    }
}