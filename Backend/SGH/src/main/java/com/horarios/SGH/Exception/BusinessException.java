package com.horarios.SGH.Exception;

public class BusinessException extends CustomException {
    public BusinessException(String message) {
        super(message, "BUSINESS_ERROR");
    }
}