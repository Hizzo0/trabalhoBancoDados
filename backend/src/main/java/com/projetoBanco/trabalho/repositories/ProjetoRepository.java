package com.projetoBanco.trabalho.repositories;

import com.projetoBanco.trabalho.models.Projeto;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface ProjetoRepository extends JpaRepository<Projeto, Long> {

    Optional<Projeto> findByCodigoUnico(String codigoUnico);

    @Modifying // Indica que é uma operação de alteração (DML)
    @Transactional // Abre uma transação para a deleção
    void deleteByCodigoUnico(String codigoUnico);

    boolean existsByCodigoUnico(String codigoUnico);

    @Query("SELECT DISTINCT p FROM Projeto p " +
            "LEFT JOIN p.vinculos v " +
            "WHERE p.coordenador.cpf = :cpf OR v.participante.cpf = :cpf")
    List<Projeto> findByParticipanteCpf(@Param("cpf") String cpf);

    // buscar por titulo
    Optional<Projeto> findByTitulo(String titulo);

}