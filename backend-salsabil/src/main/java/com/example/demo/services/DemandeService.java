package com.example.demo.services;

import java.util.List;

import org.springframework.stereotype.Service;

import entity.DemandeMaintenance;
import repository.DemandeRepository;

@Service
public class DemandeService {

    private final DemandeRepository repository;

    public DemandeService(DemandeRepository repository) {
        this.repository = repository;
    }

    public List<DemandeMaintenance> getDemandesByClient(Integer clientId) {
        return repository.findByClientId(clientId);
    }

    public List<DemandeMaintenance> getAllDemandes() {
        return repository.findAll();
    }

    public DemandeMaintenance ajouterDemande(DemandeMaintenance demande) {
        if (demande.getStatut() == null || demande.getStatut().isBlank()) {
            demande.setStatut("En attente");
        }

        return repository.save(demande);
    }
}