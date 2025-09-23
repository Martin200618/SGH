package com.horarios.SGH.Service;

public interface ITokenRevocationService {
    void revokeToken(String token);
    boolean isTokenRevoked(String token);
    void revokeAllTokensForUser(String username);
    void cleanupExpiredTokens();
    int getRevokedTokensCount();
}