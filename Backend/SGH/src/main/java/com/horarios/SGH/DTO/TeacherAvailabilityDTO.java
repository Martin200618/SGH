package com.horarios.SGH.DTO;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.horarios.SGH.Model.Days;

public class TeacherAvailabilityDTO {
    private Integer teacherId;
    private Days day;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime amStart;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime amEnd;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime pmStart;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime pmEnd;

    public TeacherAvailabilityDTO() {
    }

    public TeacherAvailabilityDTO(Integer teacherId, Days day, LocalTime amStart, LocalTime amEnd, LocalTime pmStart, LocalTime pmEnd) {
        this.teacherId = teacherId;
        this.day = day;
        this.amStart = amStart != null ? amStart.withSecond(0) : null;
        this.amEnd = amEnd != null ? amEnd.withSecond(0): null;
        this.pmStart = pmStart != null ? pmStart.withSecond(0): null;
        this.pmEnd = pmEnd != null ? pmEnd.withSecond(0) : null;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
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