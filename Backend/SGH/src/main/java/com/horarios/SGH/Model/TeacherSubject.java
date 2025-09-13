package com.horarios.SGH.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "teacher_subjects",
       uniqueConstraints = @UniqueConstraint(columnNames = {"teacher_id","subject_id"}))
public class TeacherSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teacher_subject_id")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private teachers teacher;

    @ManyToOne(optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private subjects subject;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public teachers getTeacher() { return teacher; }
    public void setTeacher(teachers teacher) { this.teacher = teacher; }

    public subjects getSubject() { return subject; }
    public void setSubject(subjects subject) { this.subject = subject; }
}