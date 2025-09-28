package com.horarios.SGH.IService;

import org.springframework.security.core.userdetails.UserDetails;
import java.util.function.Function;

public interface IJwtService {
    String extractUsername(String token);
    <T> T extractClaim(String token, Function<io.jsonwebtoken.Claims, T> claimsResolver);
    String generateToken(UserDetails userDetails);
}