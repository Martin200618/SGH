package com.horarios.SGH.Model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "TeacherAvailability",
       uniqueConstraints = @UniqueConstraint(columnNames = {"teacher_id","day","startTime","endTime"}))
public class TeacherAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private teachers teacher;

    @Column(nullable = false)
    private Days day;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    public TeacherAvailability(Long id, teachers teacher, Days day, LocalTime startTime, LocalTime endTime) {
        this.id = id;
        this.teacher = teacher;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public TeacherAvailability() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public teachers getTeacher() {
        return teacher;
    }

    public void setTeacher(teachers teacher) {
        this.teacher = teacher;
    }

    public Days getDay() {
        return day;
    }

    public void setDay(Days day) {
        this.day = day;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}