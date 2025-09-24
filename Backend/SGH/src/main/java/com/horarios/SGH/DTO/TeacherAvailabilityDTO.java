package com.horarios.SGH.DTO;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import com.horarios.SGH.Model.Days;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Schema(description = "DTO para la disponibilidad de un profesor")
public class TeacherAvailabilityDTO {
    @NotNull(message = "El ID del profesor es obligatorio")
    @Schema(description = "ID del profesor", example = "1")
    private Integer teacherId;

    @NotNull(message = "El día es obligatorio")
    @Pattern(regexp = "^(LUNES|MARTES|MIÉRCOLES|JUEVES|VIERNES|SÁBADO|DOMINGO)$", message = "El día debe ser un día válido de la semana en mayúsculas")
    @Schema(description = "Día de la semana", example = "Lunes")
    private Days day;

    @JsonFormat(pattern = "HH:mm", shape = Shape.STRING)
    @Schema(description = "Hora de inicio de la mañana", example = "08:00", type = "string", format = "time")
    private LocalTime amStart;

    @JsonFormat(pattern = "HH:mm", shape = Shape.STRING)
    @Schema(description = "Hora de fin de la mañana", example = "12:00", type = "string", format = "time")
    private LocalTime amEnd;

    @JsonFormat(pattern = "HH:mm", shape = Shape.STRING)
    @Schema(description = "Hora de inicio de la tarde", example = "14:00", type = "string", format = "time")
    private LocalTime pmStart;

    @JsonFormat(pattern = "HH:mm", shape = Shape.STRING)
    @Schema(description = "Hora de fin de la tarde", example = "18:00", type = "string", format = "time")
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