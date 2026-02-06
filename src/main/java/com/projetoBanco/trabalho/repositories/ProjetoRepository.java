package com.projetoBanco.trabalho.repositories;

import com.projetoBanco.trabalho.models.Projeto;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;

@Repository
public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    
    Optional<Projeto> findByCodigoUnico(String codigoUnico);

    @Modifying // Indica que é uma operação de alteração (DML)
    @Transactional // Abre uma transação para a deleção
    void deleteByCodigoUnico(String codigoUnico);
    
    boolean existsByCodigoUnico(String codigoUnico);

    //buscar por titulo
    Optional<Projeto> findByTitulo(String titulo);


}