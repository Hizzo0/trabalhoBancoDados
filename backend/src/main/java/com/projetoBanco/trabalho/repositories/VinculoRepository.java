package com.projetoBanco.trabalho.repositories;

import com.projetoBanco.trabalho.models.VinculoParticipacao;
import com.projetoBanco.trabalho.models.Participante;
import com.projetoBanco.trabalho.models.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VinculoRepository extends JpaRepository<VinculoParticipacao, Long> {

    // 1. Busca vínculos usando o ID técnico do Projeto
    List<VinculoParticipacao> findByProjetoId(Long projetoId);

    // 2. Busca vínculos usando o Código Único do Projeto (Navegando pelo objeto)
    List<VinculoParticipacao> findByProjeto_CodigoUnico(String codigoUnico);

    // 3. Consultar Meus Projetos usando o CPF do Participante
    @Query("SELECT v.projeto FROM VinculoParticipacao v WHERE v.participante.cpf = :cpf")
    List<Projeto> findProjetosByParticipanteCpf(@Param("cpf") String cpf);

    // 4. Buscar Participantes de um Projeto usando o Código Único
    @Query("SELECT v.participante FROM VinculoParticipacao v WHERE v.projeto.codigoUnico = :codigoUnico")
    List<Participante> findParticipantesByProjetoCodigo(@Param("codigoUnico") String codigoUnico);

    // 5. Buscar Participantes em Múltiplos Projetos (Regra de negócio complexa)
    @Query("SELECT v.participante FROM VinculoParticipacao v GROUP BY v.participante HAVING COUNT(v.projeto) > 1")
    List<Participante> findParticipantesEmMultiplosProjetos();
}