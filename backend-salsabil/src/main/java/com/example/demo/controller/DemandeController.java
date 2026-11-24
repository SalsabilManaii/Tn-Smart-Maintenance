package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.services.DemandeService;

import entity.DemandeMaintenance;
import repository.DemandeRepository;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "http://localhost:3000")
public class DemandeController {

    private final DemandeService demandeService;

    public DemandeController(
            DemandeService demandeService) {
        this.demandeService = demandeService;
    }
    
    @PostMapping
    public ResponseEntity<DemandeMaintenance> ajouterDemande(
    		@RequestBody DemandeMaintenance demande) {

        DemandeMaintenance saved = demandeService.ajouterDemande(demande);

        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<DemandeMaintenance>> getDemandesByClient(
    		@PathVariable Integer clientId) {

        List<DemandeMaintenance> demandes =demandeService.getDemandesByClient(clientId);

        return ResponseEntity.ok(demandes);
    }

    @GetMapping
    public ResponseEntity<List<DemandeMaintenance>> getAllDemandes() {

        List<DemandeMaintenance> demandes =demandeService.getAllDemandes();

        return ResponseEntity.ok(demandes);}
    }