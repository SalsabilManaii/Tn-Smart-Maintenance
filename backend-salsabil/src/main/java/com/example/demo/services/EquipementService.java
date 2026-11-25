package com.example.demo.services;

import java.util.List;

import org.springframework.stereotype.Service;

import entity.Equipement;
import repository.EquipementRepository;

@Service
public class EquipementService {

    private final EquipementRepository repository;

    public EquipementService(EquipementRepository repository) {
        this.repository = repository;
    }

    public List<Equipement> getEquipementsByClient(Integer clientId) {
        return repository.findByClientId(clientId);
    }

    public Equipement addEquipement(Equipement equipement) {
        equipement.setId(null);
        return repository.save(equipement);
    }

    public Equipement getEquipementById(Integer id) {
        return repository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Equipement introuvable"));
    }

    public Equipement updateEquipement(Integer id, Equipement updated) {

        Equipement existing = getEquipementById(id);

        existing.setDescription(updated.getDescription());
        existing.setCategorie(updated.getCategorie());
        existing.setLocalisation(updated.getLocalisation());
        existing.setStatut(updated.getStatut());

        return repository.save(existing);
    }

    public void deleteEquipement(Integer id) {

        Equipement existing = getEquipementById(id);

        repository.delete(existing);
    }
}
