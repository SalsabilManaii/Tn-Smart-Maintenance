package repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import entity.Intervention;

public interface IntervRepository
        extends JpaRepository<Intervention, Integer> {

    List<Intervention> findByTechnicienId(Integer technicienId);

    List<Intervention> findByDemandeId(Integer demandeId);

    List<Intervention> findByResponsableId(Integer responsableId);
}