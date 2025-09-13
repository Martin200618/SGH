package com.horarios.SGH.Service;

import com.horarios.SGH.Model.users;
import com.horarios.SGH.Repository.Iusers;
import com.horarios.SGH.DTO.LoginRequestDTO;
import com.horarios.SGH.DTO.LoginResponseDTO;
import com.horarios.SGH.Exception.BusinessException;
import com.horarios.SGH.jwt.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final Iusers repo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(Iusers repo, PasswordEncoder encoder, AuthenticationManager authManager, JwtTokenProvider jwtTokenProvider) {
        this.repo = repo;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public String register(String username, String rawPassword) {
        repo.findByUserName(username).ifPresent(u -> {
            throw new BusinessException("El nombre de usuario ya está en uso");
        });

        long total = repo.count();
        if (total >= 2) {
            throw new BusinessException("Límite de usuarios alcanzado (solo 2 usuarios)");
        }

        users u = new users();
        u.setUserName(username);
        u.setPassword(encoder.encode(rawPassword));
        repo.save(u);
        return "Usuario registrado correctamente";
    }

    public LoginResponseDTO login(LoginRequestDTO req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        String token = jwtTokenProvider.generateToken(req.getUsername());
        return new LoginResponseDTO(token);
    }
}