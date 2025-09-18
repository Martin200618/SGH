package com.horarios.SGH.DTO;

import java.util.List;

public class TeacherDTO {

    private String teacherName;

    // Para compatibilidad con el servicio existente
    private int teacherId;
    private int subjectId;

    // Lista de especializaciones (materias que imparte)
    private List<String> specializations;

    public TeacherDTO() {}

    public TeacherDTO(String teacherName, List<String> specializations) {
        this.teacherName = teacherName;
        this.specializations = specializations;
    }

    // Getters y Setters
    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public List<String> getSpecializations() {
        return specializations;
    }

    public void setSpecializations(List<String> specializations) {
        this.specializations = specializations;
    }

    // Métodos para compatibilidad con el servicio existente
    public int getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(int teacherId) {
        this.teacherId = teacherId;
    }

    public int getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
    }
}