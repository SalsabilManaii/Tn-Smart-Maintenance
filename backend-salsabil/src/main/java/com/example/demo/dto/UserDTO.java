package com.example.demo.dto;

import entity.Personne;

public class UserDTO {

    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private String role;

    public UserDTO() {
    }

    public UserDTO(Personne personne) {
        this.id = personne.getId();
        this.nom = personne.getNom();
        this.prenom = personne.getPrenom();
        this.email = personne.getEmail();
        this.role = personne.getRole();
    }

    public Integer getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}