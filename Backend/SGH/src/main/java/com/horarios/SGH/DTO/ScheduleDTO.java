package com.horarios.SGH.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Schema(description = "DTO para la gestión de horarios de cursos")
public class ScheduleDTO {

    @Schema(description = "ID único del horario", example = "1")
    private Integer id;

    @Schema(description = "ID del curso al que pertenece el horario", example = "1", required = true)
    private Integer courseId;

    @Schema(description = "ID del profesor (obligatorio)", example = "5", required = true)
    private Integer teacherId;

    @Schema(description = "ID de la materia (obligatorio)", example = "3", required = true)
    private Integer subjectId;

    @Schema(description = "Día de la semana", allowableValues = {"Lunes", "Martes", "Miércoles", "Jueves", "Viernes"}, example = "Lunes", required = true)
    private String day;

    @Schema(description = "Hora de inicio del horario (formato HH:mm)", example = "08:00", required = true)
    private String startTime;

    @Schema(description = "Hora de fin del horario (formato HH:mm)", example = "09:00", required = true)
    private String endTime;

    @Schema(description = "Nombre descriptivo del horario", example = "Matemáticas - Juan Pérez", required = true)
    private String scheduleName;

    @Schema(description = "Nombre del profesor (calculado automáticamente)", example = "Juan Pérez", accessMode = Schema.AccessMode.READ_ONLY)
    private String teacherName; // derivado

    @Schema(description = "Nombre de la materia (calculado automáticamente)", example = "Matemáticas", accessMode = Schema.AccessMode.READ_ONLY)
    private String subjectName; // derivado

    public ScheduleDTO() {}

    public ScheduleDTO(Integer id, Integer courseId, Integer teacherId, Integer subjectId,
                        String day, String startTime, String endTime, String scheduleName) {
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

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    // Método auxiliar para obtener LocalTime
    @JsonIgnore
    public LocalTime getStartTimeAsLocalTime() {
        return startTime != null ? LocalTime.parse(startTime, DateTimeFormatter.ofPattern("HH:mm")) : null;
    }

    // Método auxiliar para setear desde LocalTime
    @JsonIgnore
    public void setStartTimeFromLocalTime(LocalTime startTime) {
        this.startTime = startTime != null ? startTime.format(DateTimeFormatter.ofPattern("HH:mm")) : null;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    // Método auxiliar para obtener LocalTime
    @JsonIgnore
    public LocalTime getEndTimeAsLocalTime() {
        return endTime != null ? LocalTime.parse(endTime, DateTimeFormatter.ofPattern("HH:mm")) : null;
    }

    // Método auxiliar para setear desde LocalTime
    @JsonIgnore
    public void setEndTimeFromLocalTime(LocalTime endTime) {
        this.endTime = endTime != null ? endTime.format(DateTimeFormatter.ofPattern("HH:mm")) : null;
    }

    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }
}