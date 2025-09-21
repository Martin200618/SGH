package com.horarios.SGH;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.horarios.SGH.Controller.CourseController;
import com.horarios.SGH.DTO.CourseDTO;
import com.horarios.SGH.Service.CourseService;
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

@WebMvcTest(CourseController.class)
public class CourseControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateCourse() throws Exception {
        CourseDTO input = new CourseDTO();
        input.setCourseName("Matemáticas 101");
        input.setTeacherSubjectId(1);

        CourseDTO output = new CourseDTO();
        output.setCourseId(1);
        output.setCourseName("Matemáticas 101");
        output.setTeacherSubjectId(1);

        when(courseService.create(any(CourseDTO.class))).thenReturn(output);

        mockMvc.perform(post("/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseId").value(1))
                .andExpect(jsonPath("$.courseName").value("Matemáticas 101"));
    }

    @Test
    public void testGetAllCourses() throws Exception {
        CourseDTO course1 = new CourseDTO();
        course1.setCourseId(1);
        course1.setCourseName("Matemáticas 101");

        CourseDTO course2 = new CourseDTO();
        course2.setCourseId(2);
        course2.setCourseName("Física 101");

        List<CourseDTO> courses = Arrays.asList(course1, course2);

        when(courseService.getAll()).thenReturn(courses);

        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].courseName").value("Matemáticas 101"));
    }

    @Test
    public void testGetCourseById() throws Exception {
        CourseDTO course = new CourseDTO();
        course.setCourseId(1);
        course.setCourseName("Matemáticas 101");

        when(courseService.getById(1)).thenReturn(course);

        mockMvc.perform(get("/courses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseId").value(1))
                .andExpect(jsonPath("$.courseName").value("Matemáticas 101"));
    }

    @Test
    public void testUpdateCourse() throws Exception {
        CourseDTO input = new CourseDTO();
        input.setCourseName("Matemáticas Avanzadas");

        CourseDTO output = new CourseDTO();
        output.setCourseId(1);
        output.setCourseName("Matemáticas Avanzadas");

        when(courseService.update(eq(1), any(CourseDTO.class))).thenReturn(output);

        mockMvc.perform(put("/courses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseName").value("Matemáticas Avanzadas"));
    }

    @Test
    public void testDeleteCourse() throws Exception {
        doNothing().when(courseService).delete(1);

        mockMvc.perform(delete("/courses/1"))
                .andExpect(status().isOk());
    }
}