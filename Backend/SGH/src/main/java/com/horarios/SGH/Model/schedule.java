package com.horarios.SGH.Model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
public class schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private courses courseId;

    @ManyToOne
    @JoinColumn(name = "teacherId", nullable = false)
    private teachers teacherId;

    @ManyToOne
    @JoinColumn(name = "subjectId", nullable = false)
    private subjects subjectId;

    private String day;
    private LocalTime startTime;
    private LocalTime endTime;

    private String scheduleName;

    public schedule() {}

    public schedule(Integer id, courses courseId, teachers teacherId, subjects subjectId, String day, LocalTime startTime, LocalTime endTime, String scheduleName) {
        this.id = id;
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.subjectId = subjectId;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
        this.scheduleName = scheduleName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public courses getCourseId() {
        return courseId;
    }

    public void setCourseId(courses courseId) {
        this.courseId = courseId;
    }

    public teachers getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(teachers teacherId) {
        this.teacherId = teacherId;
    }

    public subjects getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(subjects subjectId) {
        this.subjectId = subjectId;
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

    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }
}