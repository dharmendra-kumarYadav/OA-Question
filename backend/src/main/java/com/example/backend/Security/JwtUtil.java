package com.example.backend.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret:ThisIsASecretKeyForJwtGenerationMustBeLongEnoughToBeSecure12345}")
    private String jwtSecret;

    @Value("${jwt.expiration:43200000}")
    private long jwtExpirationMs; // Default: 12 hours in milliseconds

    private Key key;

    public JwtUtil() {
        // Initialize key in constructor
    }

    private Key getKey() {
        if (key == null) {
            this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        }
        return key;
    }

    // ✅ Generate JWT token for authenticated user (username = email here)
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Extract email (username) from token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ✅ Validate JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ✅ Get expiration time in hours
    public long getExpirationHours() {
        return jwtExpirationMs / (1000 * 60 * 60); // Convert ms to hours
    }

    // ✅ Get expiration time in minutes (for testing short durations)
    public long getExpirationMinutes() {
        return jwtExpirationMs / (1000 * 60); // Convert ms to minutes
    }
}
