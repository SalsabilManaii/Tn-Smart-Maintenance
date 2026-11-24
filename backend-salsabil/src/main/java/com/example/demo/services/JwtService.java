package com.example.demo.services;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import entity.Personne;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    private Key key() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generate(Personne pers) {
        return Jwts.builder()
                .setSubject(pers.getId().toString())
                .claim("role", pers.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(
                    System.currentTimeMillis() + 24* 60 * 60 * 1000 )).signWith(key())
                .compact();
    }

    public Claims parse(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
