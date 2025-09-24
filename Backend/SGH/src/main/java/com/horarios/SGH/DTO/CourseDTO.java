package com.horarios.SGH.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CourseDTO {
    private int courseId;

    @NotNull(message = "El nombre del curso no puede ser nulo")
    @NotBlank(message = "El nombre del curso no puede estar vacío")
    @Size(min = 1, max = 2, message = "el nombre de curso solo puede tener dos caracteres ejemplo 1A")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ0-9\\s]+$", message = "El nombre del curso solo puede contener letras, números y espacios")
    private String courseName;

    // Director de grado opcional
    private Integer gradeDirectorId;

    public int getCourseId() {
        return courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getGradeDirectorId() {
        return gradeDirectorId;
    }

    public void setGradeDirectorId(Integer gradeDirectorId) {
        this.gradeDirectorId = gradeDirectorId;
    }
}