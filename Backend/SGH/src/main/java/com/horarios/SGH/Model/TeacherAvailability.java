package com.horarios.SGH.Model;

import jakarta.persistence.*;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "TeacherAvailability", uniqueConstraints = @UniqueConstraint(columnNames = { "teacher_id", "day" }))
public class TeacherAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private teachers teacher;

    @Column(nullable = false)
    private Days day;

    @Column
    @JsonFormat(pattern = "HH:mm")
    private LocalTime amStart;

    @Column
    @JsonFormat(pattern = "HH:mm")
    private LocalTime amEnd;

    @Column
    @JsonFormat(pattern = "HH:mm")
    private LocalTime pmStart;

    @Column
    @JsonFormat(pattern = "HH:mm")
    private LocalTime pmEnd;

    // Método auxiliar para verificar si hay al menos un horario válido
    public boolean hasValidSchedule() {
        return (amStart != null && amEnd != null) || (pmStart != null && pmEnd != null);
    }

    public TeacherAvailability() {
    }

    public TeacherAvailability(Long id, teachers teacher, Days day, LocalTime amStart, LocalTime amEnd,
            LocalTime pmStart, LocalTime pmEnd) {
        this.id = id;
        this.teacher = teacher;
        this.day = day;
        this.amStart = amStart;
        this.amEnd = amEnd;
        this.pmStart = pmStart;
        this.pmEnd = pmEnd;
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

    public LocalTime getAmStart() {
        return amStart;
    }

    public void setAmStart(LocalTime amStart) {
        this.amStart = amStart;
    }

    public LocalTime getAmEnd() {
        return amEnd;
    }

    public void setAmEnd(LocalTime amEnd) {
        this.amEnd = amEnd;
    }

    public LocalTime getPmStart() {
        return pmStart;
    }

    public void setPmStart(LocalTime pmStart) {
        this.pmStart = pmStart;
    }

    public LocalTime getPmEnd() {
        return pmEnd;
    }

    public void setPmEnd(LocalTime pmEnd) {
        this.pmEnd = pmEnd;
    }
}