package com.horarios.SGH.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.horarios.SGH.Model.users;
import com.horarios.SGH.Repository.Iusers;
import com.horarios.SGH.DTO.LoginRequestDTO;
import com.horarios.SGH.DTO.LoginResponseDTO;
import com.horarios.SGH.jwt.JwtTokenProvider;

@Service
public class AuthService {

    private final Iusers repo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(Iusers repo,
                       PasswordEncoder encoder,
                       AuthenticationManager authManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.repo = repo;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // Registra 1 usuario adicional (límite total = 2)
    public String register(String username, String rawPassword) {
        // Validaciones del username
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de usuario no puede estar vacío");
        }

        if (username.contains(" ")) {
            throw new IllegalArgumentException("El nombre de usuario no puede contener espacios");
        }

        if (!username.equals(username.toLowerCase())) {
            throw new IllegalArgumentException("El nombre de usuario no puede contener letras mayúsculas");
        }

        if (username.matches(".*\\d.*")) {
            throw new IllegalArgumentException("El nombre de usuario no puede contener números");
        }

        if (username.length() > 100) {
            throw new IllegalArgumentException("El nombre de usuario no puede exceder los 100 caracteres");
        }

        // Validación de contraseña
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña no puede estar vacía");
        }

        repo.findByUserName(username).ifPresent(u -> {
            throw new IllegalStateException("El nombre de usuario ya está en uso");
        });

        long total = repo.count();
        if (total >= 2) {
            throw new IllegalStateException("Límite de usuarios alcanzado (solo 2 usuarios)");
        }

        users u = new users();
        u.setUserName(username);
        u.setPassword(encoder.encode(rawPassword));
        repo.save(u);
        return "Usuario registrado correctamente";
    }

    // Autentica con password en texto plano y genera JWT
    public LoginResponseDTO login(LoginRequestDTO req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        // Si llega aquí, las credenciales son válidas (DB o master hardcodeado vía UserDetailsService)
        String token = jwtTokenProvider.generateToken(req.getUsername());
        return new LoginResponseDTO(token);
    }
}