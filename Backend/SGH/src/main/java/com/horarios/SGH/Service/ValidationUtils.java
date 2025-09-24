package com.horarios.SGH.Service;

public class ValidationUtils {

    public static void validateCourseName(String courseName) {
        if (courseName != null) {
            if (courseName.trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre del curso no puede estar vacío o contener solo espacios");
            }
            if (courseName.length() < 1) {
                throw new IllegalArgumentException("El nombre del curso debe tener al menos 1 caracter");
            }
            if (courseName.length() > 2) {
                throw new IllegalArgumentException("el nombre de curso solo puede tener dos caracteres ejemplo 1A");
            }
            if (!courseName.matches("^[a-zA-ZÀ-ÿ0-9\\s]+$")) {
                throw new IllegalArgumentException("El nombre del curso solo puede contener letras, números y espacios");
            }
        }
    }
}