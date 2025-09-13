package com.horarios.SGH.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private String status;
    private String message;
    private T data;
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("OK", message, data);
    }
    
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>("OK", message, null);
    }
    
    public static ApiResponse<?> error(String message) {
        return new ApiResponse<>("ERROR", message, null);
    }
}