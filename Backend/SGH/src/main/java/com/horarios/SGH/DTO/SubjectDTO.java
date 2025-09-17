package com.horarios.SGH.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SubjectDTO {
    private int subjectId;

    @NotBlank(message = "El nombre de la materia no puede estar vacío")
    @Size(min = 4, max = 18, message = "El nombre de la materia debe tener entre 4 y 18 caracteres")
    private String subjectName;

    public int getSubjectId() { return subjectId; }
    public void setSubjectId(int subjectId) { this.subjectId = subjectId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
}