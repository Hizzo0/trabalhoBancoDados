package com.projetoBanco.trabalho.repositories;

import com.projetoBanco.trabalho.models.Participante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import jakarta.transaction.Transactional;

@Repository
public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    // Busca por CPF (Útil para o login ou validação)
    Optional<Participante> findByCpf(String cpf);
    
    // Busca por Email
    Optional<Participante> findByEmail(String email);

    boolean existsByCpf(String cpf);


    //

    @Modifying
    @Transactional
    @Query("DELETE FROM Participante p WHERE p.cpf = :cpf")
    void deleteByCpf(@Param("cpf") String cpf);
}
