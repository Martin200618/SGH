package com.horarios.SGH;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.horarios.SGH.Controller.ScheduleCrudController;
import com.horarios.SGH.DTO.ScheduleDTO;
import com.horarios.SGH.Service.ScheduleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
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
    @WithMockUser(username = "testuser", roles = {"COORDINADOR"})
    public void testCrearHorario() throws Exception {
        ScheduleDTO input = new ScheduleDTO();
        input.setCourseId(1);
        input.setDay("Lunes");
        input.setStartTime(LocalTime.of(8, 0));
        input.setEndTime(LocalTime.of(10, 0));
        input.setScheduleName("Horario 1");

        List<ScheduleDTO> inputList = Arrays.asList(input);
        List<ScheduleDTO> outputList = Arrays.asList(input);

        when(scheduleService.crearHorario(any(List.class), any(String.class))).thenReturn(outputList);

        mockMvc.perform(post("/schedules-crud")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputList)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    public void testObtenerPorNombre() throws Exception {
        ScheduleDTO schedule = new ScheduleDTO();
        schedule.setId(1);
        schedule.setScheduleName("Horario 1");

        List<ScheduleDTO> schedules = Arrays.asList(schedule);

        when(scheduleService.obtenerPorNombre("Horario 1")).thenReturn(schedules);

        mockMvc.perform(get("/schedules-crud/Horario 1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    public void testGetByCourse() throws Exception {
        ScheduleDTO schedule = new ScheduleDTO();
        schedule.setId(1);
        schedule.setCourseId(1);

        List<ScheduleDTO> schedules = Arrays.asList(schedule);

        when(scheduleService.obtenerPorCurso(1)).thenReturn(schedules);

        mockMvc.perform(get("/schedules-crud/by-course/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    public void testGetByTeacher() throws Exception {
        ScheduleDTO schedule = new ScheduleDTO();
        schedule.setId(1);
        schedule.setTeacherId(1);

        List<ScheduleDTO> schedules = Arrays.asList(schedule);

        when(scheduleService.obtenerPorProfesor(1)).thenReturn(schedules);

        mockMvc.perform(get("/schedules-crud/by-teacher/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    public void testGetAll() throws Exception {
        ScheduleDTO schedule1 = new ScheduleDTO();
        schedule1.setId(1);

        ScheduleDTO schedule2 = new ScheduleDTO();
        schedule2.setId(2);

        List<ScheduleDTO> schedules = Arrays.asList(schedule1, schedule2);

        when(scheduleService.obtenerTodos()).thenReturn(schedules);

        mockMvc.perform(get("/schedules-crud"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}