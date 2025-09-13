package com.horarios.SGH.jwt;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long validityInMs; // milisegundos

    private byte[] hmacSha256(byte[] data, byte[] key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key, "HmacSHA256"));
        return mac.doFinal(data);
    }

    private String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private byte[] base64UrlDecode(String str) {
        return Base64.getUrlDecoder().decode(str);
    }

    public String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    public String generateToken(String username) {
        long nowMillis = System.currentTimeMillis();
        long expMillis = nowMillis + validityInMs;

        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        long iatSec = Instant.ofEpochMilli(nowMillis).getEpochSecond();
        long expSec = Instant.ofEpochMilli(expMillis).getEpochSecond();
        String payloadJson = "{\"sub\":\"" + escapeJson(username) + "\",\"iat\":" + iatSec + ",\"exp\":" + expSec + "}";

        String header = base64UrlEncode(headerJson.getBytes(StandardCharsets.UTF_8));
        String payload = base64UrlEncode(payloadJson.getBytes(StandardCharsets.UTF_8));
        String signingInput = header + "." + payload;

        try {
            byte[] signature = hmacSha256(signingInput.getBytes(StandardCharsets.UTF_8), secret.getBytes(StandardCharsets.UTF_8));
            String sig = base64UrlEncode(signature);
            return signingInput + "." + sig;
        } catch (Exception e) {
            throw new IllegalStateException("Error firmando token", e);
        }
    }

    public String getUsernameFromToken(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) return null;

        String payloadJson = new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8);
        return extractJsonString(payloadJson, "sub");
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String signingInput = parts[0] + "." + parts[1];
            byte[] expectedSig = hmacSha256(signingInput.getBytes(StandardCharsets.UTF_8), secret.getBytes(StandardCharsets.UTF_8));
            byte[] providedSig = base64UrlDecode(parts[2]);

            if (!constantTimeEquals(expectedSig, providedSig)) return false;

            String payloadJson = new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8);
            Long exp = extractJsonNumber(payloadJson, "exp");
            if (exp != null) {
                long nowSec = Instant.now().getEpochSecond();
                if (nowSec >= exp) return false;
            }

            String sub = extractJsonString(payloadJson, "sub");
            return sub != null && sub.equals(userDetails.getUsername());
        } catch (Exception e) {
            return false;
        }
    }

    private boolean constantTimeEquals(byte[] a, byte[] b) {
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
        int result = 0;
        for (int i = 0; i < a.length; i++) result |= a[i] ^ b[i];
        return result == 0;
    }

    private static final Pattern STRING_FIELD = Pattern.compile("\"([^\"]+)\"\\s*:\\s*\"([^\"]*)\"");
    private static final Pattern NUMBER_FIELD = Pattern.compile("\"([^\"]+)\"\\s*:\\s*(\\d+)");

    private String extractJsonString(String json, String key) {
        Matcher m = STRING_FIELD.matcher(json);
        while (m.find()) {
            if (key.equals(m.group(1))) return m.group(2);
        }
        return null;
    }

    private Long extractJsonNumber(String json, String key) {
        Matcher m = NUMBER_FIELD.matcher(json);
        while (m.find()) {
            if (key.equals(m.group(1))) return Long.parseLong(m.group(2));
        }
        return null;
    }

    private String escapeJson(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
