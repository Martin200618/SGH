package com.horarios.SGH.Model;

import jakarta.persistence.*;

@Entity(name="subjects")
public class subjects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="subjectId")
    private int id;

    @Column(name="subjectName", length = 70, nullable=false, unique=true)
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