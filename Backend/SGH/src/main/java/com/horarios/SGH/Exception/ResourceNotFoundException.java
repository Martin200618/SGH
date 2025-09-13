package com.horarios.SGH.Exception;

public class ResourceNotFoundException extends CustomException {
    public ResourceNotFoundException(String resourceName, Object id) {
        super(resourceName + " con ID " + id + " no encontrado", "NOT_FOUND");
    }
}