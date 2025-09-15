package com.horarios.SGH.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity(name="subjects")
public class subjects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="subjectId")
    private int id;

    @Column(name="subjectName", nullable=false, unique=true)
    @Size(min = 5, max = 50, message = "El nombre de la asignatura debe tener entre 5 y 50 caracteres")
    private String subjectName;

    public subjects() {}

    public subjects(int id, String subjectName) {
        this.id = id;
        this.subjectName = subjectName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
}