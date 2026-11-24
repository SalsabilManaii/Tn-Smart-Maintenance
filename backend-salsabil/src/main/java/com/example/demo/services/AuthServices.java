package com.example.demo.services;

import java.util.HashMap;
import java.util.Map;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import entity.Personne;
import repository.PersonneRepository;


@Service
public class AuthServices {

  private final PersonneRepository persrepo;
  private final PasswordEncoder encoder;
  private final JwtService jwtService;

  public AuthServices(PersonneRepository persrepo, PasswordEncoder encoder, JwtService jwtService) {
    this.persrepo = persrepo;
    this.encoder = encoder;
    this.jwtService = jwtService;
  }

  @Transactional
  public Personne register(Personne p) {
    if (p.getNom() == null || p.getNom().isBlank())
      throw new IllegalArgumentException("Le nom est obligatoire");
    if (p.getPrenom() == null || p.getPrenom().isBlank())
      throw new IllegalArgumentException("Le prénom est obligatoire");
    if (p.getEmail() == null || !p.getEmail().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"))
      throw new IllegalArgumentException("Format d'email invalide");
    if (p.getMdp() == null || p.getMdp().length() < 8)
      throw new IllegalArgumentException("Mot de passe : 8 caractères minimum");
    if (persrepo.findByEmail(p.getEmail()).isPresent())
      throw new IllegalArgumentException("Email déjà utilisé");

    Personne n = new Personne();
    n.setNom(p.getNom().trim());
    n.setPrenom(p.getPrenom().trim());
    n.setEmail(p.getEmail().trim().toLowerCase());
    n.setMdp(encoder.encode(p.getMdp()));
    n.setRole("CLIENT"); 
    return persrepo.save(n);
  }

  @Transactional(readOnly = true)
  public Map<String, Object> login(String email, String mdp) {
    Personne u = persrepo.findByEmail(email.trim().toLowerCase())
        .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect"));
    if (!encoder.matches(mdp, u.getMdp()))
      throw new BadCredentialsException("Email ou mot de passe incorrect");
    String token = jwtService.generate(u);

    Map<String, Object> result = new HashMap<>();
    result.put("token", token);
    result.put("id", u.getId());
    result.put("role", u.getRole());

    return result;
  }

}
