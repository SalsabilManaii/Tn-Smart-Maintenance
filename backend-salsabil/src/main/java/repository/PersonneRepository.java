package repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import entity.Personne;

public interface PersonneRepository extends JpaRepository<Personne, Integer> {

    Optional<Personne> findByEmail(String email);

    List<Personne> findByRoleIgnoreCase(String role);

    long countByRole(String role);
}