package com.horarios.SGH.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SubjectDTO {
    private int subjectId;

    @NotNull(message = "El nombre de la materia no puede ser nulo")
    @NotBlank(message = "El nombre de la materia no puede estar vacío")
    @Size(min = 5, max = 20, message = "El nombre de la materia debe tener entre 5 y 20 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "El nombre de la materia solo puede contener letras y espacios")
    private String subjectName;

    public int getSubjectId() { return subjectId; }
    public void setSubjectId(int subjectId) { this.subjectId = subjectId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
}