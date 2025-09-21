package com.horarios.SGH.Model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Días de la semana")
public enum Days {
    @Schema(description = "Lunes") Lunes,
    @Schema(description = "Martes") Martes,
    @Schema(description = "Miércoles") Miércoles,
    @Schema(description = "Jueves") Jueves,
    @Schema(description = "Viernes") Viernes;

}