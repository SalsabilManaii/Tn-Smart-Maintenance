package repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import entity.Equipement;

public interface EquipementRepository
        extends JpaRepository<Equipement, Integer> {

    List<Equipement> findByClientId(Integer clientId);
}
