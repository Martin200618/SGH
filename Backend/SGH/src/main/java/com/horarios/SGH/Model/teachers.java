package com.horarios.SGH.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity(name="teachers")
public class teachers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="teacherId")
    private int id;

    @Column(name="teacherName", length = 100, nullable=false)
    @Size(min = 12, max = 40, message = "El nombre del profesor debe tener entre 12 y 40 caracteres")
    private String teacherName;

    public teachers() {}

    public teachers(int id, String teacherName) {
        this.id = id;
        this.teacherName = teacherName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    
}