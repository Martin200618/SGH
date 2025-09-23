package com.horarios.SGH.Service;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenRevocationService {

    // Almacén de tokens revocados (en producción usarías Redis o BD)
    private final Set<String> revokedTokens = ConcurrentHashMap.newKeySet();

    /**
     * Revoca un token específico
     */
    public void revokeToken(String token) {
        if (token != null && !token.trim().isEmpty()) {
            revokedTokens.add(token);
        }
    }

    /**
     * Verifica si un token está revocado
     */
    public boolean isTokenRevoked(String token) {
        return token != null && revokedTokens.contains(token);
    }

    /**
     * Revoca todos los tokens de un usuario (útil para logout forzado)
     */
    public void revokeAllTokensForUser(String username) {
        // En una implementación completa, mantendrías una relación usuario-token
        // Por ahora, este método está preparado para futuras implementaciones
    }

    /**
     * Limpia tokens expirados (mantenimiento)
     */
    public void cleanupExpiredTokens() {
        // En producción, implementarías limpieza periódica
        // Por ahora, los tokens se mantienen hasta reinicio de aplicación
    }

    /**
     * Obtiene el número de tokens revocados (para monitoreo)
     */
    public int getRevokedTokensCount() {
        return revokedTokens.size();
    }
}