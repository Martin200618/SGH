package com.horarios.SGH.IService;

public interface ITokenRevocationService {
    void revokeToken(String token);
    boolean isTokenRevoked(String token);
    void revokeAllTokensForUser(String username);
    void cleanupExpiredTokens();
    int getRevokedTokensCount();
}