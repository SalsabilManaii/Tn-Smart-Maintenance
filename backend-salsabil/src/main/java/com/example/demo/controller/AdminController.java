package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.example.demo.services.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    // GET ALL USERS
    @GetMapping("/users")
    public List<Map<String, Object>> getAllUsers() {
        return service.getAllUsers();
    }

    // GET STATISTICS
    @GetMapping("/statistics")
    public Map<String, Long> getStatistics() {
        return service.getStatistics();
    }

    // CHANGE USER ROLE
    @PutMapping("/users/{id}/role")
    public Map<String, Object> updateRole(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {

        return service.updateRole(id, request.get("role"));
    }

    // DELETE USER
    @DeleteMapping("/users/{id}")
    public Map<String, String> deleteUser(
            @PathVariable Integer id) {

        service.deleteUser(id);

        return Map.of(
            "message",
            "Utilisateur supprimé avec succès"
        );
    }
}
