package com.horarios.SGH;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.horarios.SGH.Controller.TeacherAvailabilityController;
import com.horarios.SGH.DTO.TeacherAvailabilityDTO;
import com.horarios.SGH.Model.Days;
import com.horarios.SGH.Model.TeacherAvailability;
import com.horarios.SGH.Model.teachers;
import com.horarios.SGH.Repository.ITeacherAvailabilityRepository;
import com.horarios.SGH.Repository.Iteachers;
import com.horarios.SGH.Repository.TeacherSubjectRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TeacherAvailabilityController.class)
public class TeacherAvailabilityControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ITeacherAvailabilityRepository availabilityRepo;

    @MockBean
    private Iteachers teacherRepo;

    @MockBean
    private TeacherSubjectRepository teacherSubjectRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegisterAvailabilitySuccess() throws Exception {
        TeacherAvailabilityDTO input = new TeacherAvailabilityDTO();
        input.setTeacherId(1);
        input.setDay(Days.Lunes);
        input.setAmStart(LocalTime.of(8, 0));
        input.setAmEnd(LocalTime.of(12, 0));

        teachers teacher = new teachers();
        teacher.setId(1);
        teacher.setTeacherName("Juan Pérez");

        when(teacherRepo.findById(1)).thenReturn(Optional.of(teacher));
        when(availabilityRepo.findByTeacher_IdAndDay(1, Days.Lunes)).thenReturn(Arrays.asList());
        when(availabilityRepo.save(any(TeacherAvailability.class))).thenReturn(new TeacherAvailability());

        mockMvc.perform(post("/availability/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(content().string("Disponibilidad registrada correctamente para Juan Pérez el día Lunes"));
    }

    @Test
    public void testRegisterAvailabilityTeacherNotFound() throws Exception {
        TeacherAvailabilityDTO input = new TeacherAvailabilityDTO();
        input.setTeacherId(1);
        input.setDay(Days.Lunes);

        when(teacherRepo.findById(1)).thenReturn(Optional.empty());

        mockMvc.perform(post("/availability/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    public void testRegisterAvailabilityAlreadyExists() throws Exception {
        TeacherAvailabilityDTO input = new TeacherAvailabilityDTO();
        input.setTeacherId(1);
        input.setDay(Days.Lunes);

        teachers teacher = new teachers();
        teacher.setId(1);

        TeacherAvailability existing = new TeacherAvailability();

        when(teacherRepo.findById(1)).thenReturn(Optional.of(teacher));
        when(availabilityRepo.findByTeacher_IdAndDay(1, Days.Lunes)).thenReturn(Arrays.asList(existing));

        mockMvc.perform(post("/availability/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    public void testGetAvailability() throws Exception {
        teachers teacher = new teachers();
        teacher.setId(1);
        teacher.setTeacherName("Juan Pérez");

        TeacherAvailability availability = new TeacherAvailability();
        availability.setDay(Days.Lunes);

        List<TeacherAvailability> availabilities = Arrays.asList(availability);

        when(teacherRepo.findById(1)).thenReturn(Optional.of(teacher));
        when(availabilityRepo.findByTeacher_Id(1)).thenReturn(availabilities);

        mockMvc.perform(get("/availability/by-teacher/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    public void testGetAvailableTeachers() throws Exception {
        teachers teacher = new teachers();
        teacher.setId(1);
        teacher.setTeacherName("Juan Pérez");

        when(teacherSubjectRepo.findBySubject_Id(1)).thenReturn(Arrays.asList()); // Mock TeacherSubject

        mockMvc.perform(get("/availability/available")
                .param("day", "Lunes")
                .param("start", "08:00")
                .param("end", "12:00")
                .param("subjectId", "1"))
                .andExpect(status().isOk());
    }
}