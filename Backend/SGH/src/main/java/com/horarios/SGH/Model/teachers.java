package com.horarios.SGH.Model;

import jakarta.persistence.*;

@Entity(name="teachers")
public class teachers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="teacherId")
    private int id;

    @Column(name="teacherName", length = 100, nullable=false)
    private String teacherName;

    // Se elimina la relación directa con subjects.
    // La relación docente–materia ahora vive en TeacherSubject.

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