package com.projetoBanco.trabalho.repositories;

import com.projetoBanco.trabalho.models.ProducaoParticipante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProducaoParticipanteRepository extends JpaRepository<ProducaoParticipante, Long> {
    
    // Buscar por CPF do participante
    List<ProducaoParticipante> findByCpfParticipante(String cpfParticipante);

    // Buscar por ID da produção
    List<ProducaoParticipante> findByProducaoId(Long producaoId);

    // Buscar um participante específico em uma produção
    Optional<ProducaoParticipante> findByCpfParticipanteAndProducaoId(String cpfParticipante, Long producaoId);

    // Buscar participantes ativos de uma produção
    List<ProducaoParticipante> findByProducaoIdAndAtivoTrue(Long producaoId);
}
