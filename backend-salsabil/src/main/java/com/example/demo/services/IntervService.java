package com.example.demo.services;

import java.util.List;

import org.springframework.stereotype.Service;

import entity.Intervention;
import repository.IntervRepository;

@Service
public class IntervService {

    private final IntervRepository repository;

    public IntervService(IntervRepository repository) {
        this.repository = repository;
    }

    public List<Intervention> getAllInterventions() {
        return repository.findAll();
    }

    public Intervention getInterventionById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Intervention not found with ID: " + id));
    }

    public List<Intervention> getByTechnicien(Integer technicienId) {
        return repository.findByTechnicienId(technicienId);
    }

    public List<Intervention> getByDemande(Integer demandeId) {
        return repository.findByDemandeId(demandeId);
    }

    public List<Intervention> getByResponsable(Integer responsableId) {
        return repository.findByResponsableId(responsableId);
    }

    public Intervention ajouterIntervention(Intervention intervention) {

        if (intervention.getStatut() == null ||
                intervention.getStatut().isBlank()) {
            intervention.setStatut("Planifiée");
        }

        return repository.save(intervention);
    }

    public Intervention modifierIntervention(
            Integer id, Intervention nouvellesDonnees) {

        Intervention intervention = getInterventionById(id);

        intervention.setDatePrevue(nouvellesDonnees.getDatePrevue());
        intervention.setHeureDebut(nouvellesDonnees.getHeureDebut());
        intervention.setHeureFin(nouvellesDonnees.getHeureFin());
        intervention.setStatut(nouvellesDonnees.getStatut());
        intervention.setType(nouvellesDonnees.getType());
        intervention.setResponsableId(nouvellesDonnees.getResponsableId());
        intervention.setDemandeId(nouvellesDonnees.getDemandeId());
        intervention.setTechnicienId(nouvellesDonnees.getTechnicienId());
        return repository.save(intervention);
    }

    public void supprimerIntervention(Integer id) {
        Intervention intervention = getInterventionById(id);
        repository.delete(intervention);
    }
    
    public Intervention modifierStatut(Integer id, String nouveauStatut) {

        Intervention intervention = getInterventionById(id);

        intervention.setStatut(nouveauStatut);

        return repository.save(intervention);
    }
}
