package com.horarios.SGH.Exception;

public class ConflictException extends CustomException {
    public ConflictException(String message) {
        super(message, "CONFLICT");
    }
}