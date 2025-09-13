package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.ApiResponse;
import com.horarios.SGH.DTO.LoginRequestDTO;
import com.horarios.SGH.DTO.LoginResponseDTO;
import com.horarios.SGH.DTO.RegisterRequestDTO;
import com.horarios.SGH.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    public ApiResponse<?> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO resp = service.login(request);
            return ApiResponse.success("Login exitoso", resp);
        } catch (Exception e) {
            return ApiResponse.error("Credenciales inválidas");
        }
    }

    // REGISTER
    @PostMapping("/register")
    public ApiResponse<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            String msg = service.register(request.getUsername(), request.getPassword());
            return ApiResponse.success(msg);
        } catch (IllegalStateException ex) {
            return ApiResponse.error(ex.getMessage());
        }
    }
}