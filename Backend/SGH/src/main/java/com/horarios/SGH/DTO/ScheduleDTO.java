package com.horarios.SGH.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Schema(description = "DTO para la gestión de horarios de cursos")
public class ScheduleDTO {

    @Schema(description = "ID único del horario", example = "1")
    private Integer id;

    @NotNull(message = "El ID del curso es obligatorio")
    @Schema(description = "ID del curso al que pertenece el horario", example = "1", required = true)
    private Integer courseId;

    @NotNull(message = "El ID del profesor es obligatorio")
    @Schema(description = "ID del profesor (obligatorio)", example = "5", required = true)
    private Integer teacherId;

    @NotNull(message = "El ID de la materia es obligatorio")
    @Schema(description = "ID de la materia (obligatorio)", example = "3", required = true)
    private Integer subjectId;

    @NotBlank(message = "El día de la semana es obligatorio")
    @Pattern(regexp = "^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)$", message = "El día debe ser un día válido de la semana")
    @Schema(description = "Día de la semana", allowableValues = {"Lunes", "Martes", "Miércoles", "Jueves", "Viernes"}, example = "Lunes", required = true)
    private String day;

    @NotBlank(message = "La hora de inicio es obligatoria")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "La hora de inicio debe tener formato HH:mm válido")
    @Schema(description = "Hora de inicio del horario (formato HH:mm)", example = "08:00", required = true)
    private String startTime;

    @NotBlank(message = "La hora de fin es obligatoria")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "La hora de fin debe tener formato HH:mm válido")
    @Schema(description = "Hora de fin del horario (formato HH:mm)", example = "09:00", required = true)
    private String endTime;

    @NotBlank(message = "El nombre del horario es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre del horario debe tener entre 3 y 100 caracteres")
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