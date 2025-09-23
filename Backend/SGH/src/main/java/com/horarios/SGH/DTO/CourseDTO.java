package com.horarios.SGH.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CourseDTO {
    private int courseId;

    @NotNull(message = "El nombre del curso no puede ser nulo")
    @NotBlank(message = "El nombre del curso no puede estar vacío")
    @Size(min = 1, max = 2, message = "El nombre del curso debe tener entre 1 y 2 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "El nombre del curso solo puede contener letras y números")
    private String courseName;

    // Preferido: id de la relación docente–materia
    private Integer teacherSubjectId;

    // Compatibilidad: si no mandas teacherSubjectId, puedes mandar teacherId + subjectId
    private Integer teacherId;
    private Integer subjectId;

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

    public Integer getTeacherSubjectId() {
        return teacherSubjectId;
    }

    public void setTeacherSubjectId(Integer teacherSubjectId) {
        this.teacherSubjectId = teacherSubjectId;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    public Integer getGradeDirectorId() {
        return gradeDirectorId;
    }

    public void setGradeDirectorId(Integer gradeDirectorId) {
        this.gradeDirectorId = gradeDirectorId;
    }
}