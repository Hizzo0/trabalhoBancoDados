package com.projetoBanco.trabalho.repositories;
import com.projetoBanco.trabalho.models.Financiamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface FinanciamentoRepository extends JpaRepository<Financiamento, Long> {
    //Buscar Financiamentos por Agência
    List<Financiamento> findByAgenciaFinanciadorContainingIgnoreCase(String agencia);

    // Buscar Financiamentos por projeto apoiado codigo unico
    List<Financiamento> findByProjeto_CodigoUnico(String codigoUnico);

    // Buscar Financiamento por Agência Exata
    java.util.Optional<Financiamento> findByAgenciaFinanciador(String agencia);
}