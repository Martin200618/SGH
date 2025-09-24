package com.horarios.SGH.Service;

public class ValidationUtils {

    public static void validateCourseName(String courseName) {
        if (courseName != null) {
            if (courseName.length() < 1) {
                throw new IllegalArgumentException("El nombre del curso debe tener al menos 1 caracter");
            }
            if (courseName.length() > 50) {
                throw new IllegalArgumentException("El nombre del curso debe tener máximo 50 caracteres");
            }
        }
    }
}