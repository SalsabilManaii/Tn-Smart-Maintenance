package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import entity.Personne;
import repository.PersonneRepository;

@RestController
@RequestMapping("/api/personnes")
@CrossOrigin(origins = "http://localhost:3000")
public class TechnicienController {

    private final PersonneRepository personneRepository;

    public TechnicienController(PersonneRepository personneRepository) {
        this.personneRepository = personneRepository;
    }

    @GetMapping("/techniciens")
    public List<Map<String, Object>> getTechniciens() {

        List<Personne> techniciens =
                personneRepository.findByRoleIgnoreCase("TECHNICIEN");

        List<Map<String, Object>> resultat = new java.util.ArrayList<>();

        for (Personne personne : techniciens) {

            Map<String, Object> technicien = new java.util.HashMap<>();

            technicien.put("id", personne.getId());
            technicien.put("nom", personne.getNom());
            technicien.put("prenom", personne.getPrenom());

            resultat.add(technicien);
        }

        return resultat;
    }
}
