package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.demo.services.EquipementService;

import entity.Equipement;

@RestController
@RequestMapping("/api/equipements")
@CrossOrigin(origins = "http://localhost:3000")
public class EquipementController {

    private final EquipementService service;

    public EquipementController(EquipementService service) {
        this.service = service;
    }

    @GetMapping("/client/{clientId}")
    public List<Equipement> getByClient(
            @PathVariable Integer clientId) {

        return service.getEquipementsByClient(clientId);
    }

    @PostMapping
    public Equipement addEquipement(
            @RequestBody Equipement equipement) {

        return service.addEquipement(equipement);
    }

    @GetMapping("/{id}")
    public Equipement getById(@PathVariable Integer id) {
        return service.getEquipementById(id);
    }

    @PutMapping("/{id}")
    public Equipement updateEquipement(
            @PathVariable Integer id,
            @RequestBody Equipement equipement) {

        return service.updateEquipement(id, equipement);
    }

    @DeleteMapping("/{id}")
    public String deleteEquipement(@PathVariable Integer id) {

        service.deleteEquipement(id);

        return "Equipement supprimé avec succès";
    }
}
