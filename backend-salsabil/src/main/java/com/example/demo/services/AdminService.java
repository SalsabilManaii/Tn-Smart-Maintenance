package com.example.demo.services;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import entity.Personne;
import repository.PersonneRepository;

@Service
public class AdminService {

    private final PersonneRepository repository;

    public AdminService(PersonneRepository repository) {
        this.repository = repository;
    }

    private final List<String> allowedRoles = Arrays.asList(
        "Administrateur",
        "Technicien",
        "Client",
        "ResponsableMaintenance"
    );

    // GET ALL USERS
    public List<Map<String, Object>> getAllUsers() {

        return repository.findAll().stream()
            .map(user -> Map.<String, Object>of(
                "id", user.getId(),
                "nom", user.getNom(),
                "prenom", user.getPrenom(),
                "email", user.getEmail(),
                "role", user.getRole()
            ))
            .toList();
    }

    // STATISTICS
    public Map<String, Long> getStatistics() {

        return Map.of(
            "total", repository.count(),
            "administrateurs", repository.countByRole("Administrateur"),
            "techniciens", repository.countByRole("Technicien"),
            "clients", repository.countByRole("Client"),
            "responsables", repository.countByRole("ResponsableMaintenance")
        );
    }

    // CHANGE ROLE
    public Map<String, Object> updateRole(Integer id, String newRole) {

        if (!allowedRoles.contains(newRole)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Rôle invalide"
            );
        }

        Personne user = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Utilisateur introuvable"
            ));

        user.setRole(newRole);

        repository.save(user);

        return Map.of(
            "id", user.getId(),
            "nom", user.getNom(),
            "prenom", user.getPrenom(),
            "email", user.getEmail(),
            "role", user.getRole()
        );
    }

    // DELETE USER
    public void deleteUser(Integer id) {

        Personne user = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Utilisateur introuvable"
            ));

        repository.delete(user);
    }
}