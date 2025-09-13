package com.horarios.SGH.DTO;

import java.time.LocalTime;

public class TeacherAvailabilityDTO {
    private Integer teacherId;
    private String day;
    private LocalTime startTime;
    private LocalTime endTime;


    public TeacherAvailabilityDTO() {
    }

    public TeacherAvailabilityDTO(Integer teacherId, String day, LocalTime startTime, LocalTime endTime) {
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

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
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