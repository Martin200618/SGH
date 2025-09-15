package com.horarios.SGH.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity(name="courses")
public class courses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="courseId")
    private int id;

    @Column(name="courseName", nullable=false, unique=true)
    @Size(min = 3, max = 30, message = "El nombre del curso debe tener entre 3 y 30 caracteres")
    private String courseName;

    // Docente+Materia que imparte el curso
    @ManyToOne
    @JoinColumn(name = "teacher_subject_id")
    private TeacherSubject teacherSubject;

    // Director de grado (uno por curso, opcional)
    @ManyToOne
    @JoinColumn(name = "grade_director_id")
    private teachers gradeDirector;

    public courses() {}

    public courses(int id, String courseName) {
        this.id = id;
        this.courseName = courseName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public TeacherSubject getTeacherSubject() {
        return teacherSubject;
    }

    public void setTeacherSubject(TeacherSubject teacherSubject) {
        this.teacherSubject = teacherSubject;
    }

    public teachers getGradeDirector() {
        return gradeDirector;
    }

    public void setGradeDirector(teachers gradeDirector) {
        this.gradeDirector = gradeDirector;
    }
}