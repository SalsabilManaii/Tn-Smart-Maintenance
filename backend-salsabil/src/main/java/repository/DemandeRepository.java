package repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import entity.DemandeMaintenance;

public interface DemandeRepository extends JpaRepository<DemandeMaintenance, Integer> {

    List<DemandeMaintenance> findByClientId(Integer clientId);	
    }