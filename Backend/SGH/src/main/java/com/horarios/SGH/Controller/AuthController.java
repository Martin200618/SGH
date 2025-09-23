package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.LoginRequestDTO;
import com.horarios.SGH.DTO.LoginResponseDTO;
import com.horarios.SGH.DTO.RegisterRequestDTO;
import com.horarios.SGH.Service.AuthService;
import com.horarios.SGH.Service.TokenRevocationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;
    private final TokenRevocationService tokenRevocationService;

    public AuthController(AuthService service, TokenRevocationService tokenRevocationService) {
        this.service = service;
        this.tokenRevocationService = tokenRevocationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO resp = service.login(request);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            String msg = service.register(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                tokenRevocationService.revokeToken(token);
                return ResponseEntity.ok(Map.of("message", "Sesión cerrada exitosamente"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Token no proporcionado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cerrar sesión"));
        }
    }
}