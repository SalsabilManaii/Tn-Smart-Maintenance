package com.example.demo.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;
import java.util.Map;
import com.example.demo.services.IntervService;

import entity.Intervention;

@RestController
@RequestMapping("/api/interventions")
@CrossOrigin(origins = "http://localhost:3000")
public class IntervController {

    private final IntervService interventionService;

    public IntervController(IntervService intervService) {
        this.interventionService = intervService;
    }

    @GetMapping
    public ResponseEntity<List<Intervention>> getAllInterventions() {
        return ResponseEntity.ok(
                interventionService.getAllInterventions());
    }

  
    @GetMapping("/{id}")
    public ResponseEntity<Intervention> getInterventionById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                interventionService.getInterventionById(id));
    }

    @GetMapping("/technicien/{technicienId}")
    public ResponseEntity<List<Intervention>> getByTechnicien(
            @PathVariable Integer technicienId) {

        return ResponseEntity.ok(
                interventionService.getByTechnicien(technicienId));
    }

    @GetMapping("/demande/{demandeId}")
    public ResponseEntity<List<Intervention>> getByDemande(
            @PathVariable Integer demandeId) {

        return ResponseEntity.ok(
                interventionService.getByDemande(demandeId));
    }

    @GetMapping("/responsable/{responsableId}")
    public ResponseEntity<List<Intervention>> getByResponsable(
            @PathVariable Integer responsableId) {

        return ResponseEntity.ok(
                interventionService.getByResponsable(responsableId));
    }

    @PostMapping
    public ResponseEntity<Intervention> ajouterIntervention(
            @RequestBody Intervention intervention) {

        return ResponseEntity.ok(
                interventionService.ajouterIntervention(intervention));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Intervention> modifierIntervention(
            @PathVariable Integer id,
            @RequestBody Intervention intervention) {

        return ResponseEntity.ok(
                interventionService.modifierIntervention(id, intervention));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerIntervention(
            @PathVariable Integer id) {

        interventionService.supprimerIntervention(id);
        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/{id}/statut")
    public ResponseEntity<Intervention> modifierStatut(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {

        String nouveauStatut = body.get("statut");

        return ResponseEntity.ok(
            interventionService.modifierStatut(id, nouveauStatut)
        );
    }
}
