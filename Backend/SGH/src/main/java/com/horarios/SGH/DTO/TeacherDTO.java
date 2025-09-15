package com.horarios.SGH.DTO;

import java.util.List;

import com.horarios.SGH.Model.subjects;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TeacherDTO {
    private int teacherId;

    @NotBlank(message = "El nombre del docente no puede estar vacío")
    @Size(min = 12, max = 40, message = "El nombre del docente debe tener entre 12 y 40 caracteres")
    private String teacherName;
    
    @NotNull(message = "La materia es obligatoria")
    @Min(value = 1, message = "Debe seleccionar una materia válida")
    private Integer subjectId;

    @Valid
    private List<TeacherAvailabilityDTO> availability;
    

    public TeacherDTO() {
    }

    public TeacherDTO(int teacherId, String teacherName, int subjectId) {
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.subjectId = subjectId;
    }

    public List<TeacherAvailabilityDTO> getAvailability() {
        return availability;
    }
    
    public void setAvailability(List<TeacherAvailabilityDTO> availability) {
        this.availability = availability;
    }

    public int getSubjectId() {
        return subjectId;
    }
    
    public void setSubjectId(int subjectId) { 
        this.subjectId = subjectId; 
    }

    public int getTeacherId() { 
        return teacherId; 
    }
    
    public void setTeacherId(int teacherId) { 
        this.teacherId = teacherId; 
    }

    public String getTeacherName() { 
        return teacherName; 
    }

    public void setTeacherName(String teacherName) { 
        this.teacherName = teacherName; 
    }
}