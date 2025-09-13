package com.horarios.SGH.Exception;

public class ValidationException extends CustomException {
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR");
    }
}