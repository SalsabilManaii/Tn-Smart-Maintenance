package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import entity.Personne;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final com.example.demo.services.AuthServices authServ;

    public AuthController(com.example.demo.services.AuthServices authServices) {
        this.authServ = authServices;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Personne pers) {
        return ResponseEntity.ok(authServ.register(pers));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Personne pers) {

        Map<String, Object> result =
            authServ.login(pers.getEmail(), pers.getMdp());

        return ResponseEntity.ok(result);
    }
}