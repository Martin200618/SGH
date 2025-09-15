package com.horarios.SGH.DTO;

import java.time.LocalTime;

import com.horarios.SGH.Model.Days;

public class TeacherAvailabilityDTO {
    private Integer teacherId;
    private Days day;
    private LocalTime startTime;
    private LocalTime endTime;


    public TeacherAvailabilityDTO() {
    }

    public TeacherAvailabilityDTO(Integer teacherId, Days day, LocalTime startTime, LocalTime endTime) {
        this.teacherId = teacherId;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
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