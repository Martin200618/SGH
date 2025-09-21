package com.horarios.SGH.DTO;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
public class usersDTO {
    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(max = 50, message = "El nombre de usuario no puede exceder los 50 caracteres")
    @Pattern(regexp = "^[a-z]*$", message = "El nombre de usuario solo puede contener letras minúsculas")
    private String userName;

    @NotBlank(message = "La contraseña no puede estar vacía")
    private String password;
}