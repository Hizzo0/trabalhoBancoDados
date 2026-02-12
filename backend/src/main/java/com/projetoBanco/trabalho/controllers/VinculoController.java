package com.projetoBanco.trabalho.controllers;

import com.projetoBanco.trabalho.dto.VinculoDTO;
import com.projetoBanco.trabalho.models.*;
import com.projetoBanco.trabalho.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/vinculos")
public class VinculoController {

    @Autowired
    private VinculoRepository vinculoRepository;
    @Autowired
    private ProjetoRepository projetoRepository;
    @Autowired
    private ParticipanteRepository participanteRepository;



    @PostMapping("/vincular")
    public ResponseEntity<?> criarVinculoComBody(@RequestBody VinculoDTO vinculoDTO) {

        // 1. Busca o Projeto pelo Código Único
        Projeto projeto = projetoRepository.findByCodigoUnico(vinculoDTO.getCodigoProjeto())
                .orElse(null);

        // 2. Busca o Participante pelo CPF
        Participante participante = participanteRepository.findByCpf(vinculoDTO.getCpfParticipante())
                .orElse(null);

        // Validação: Se um dos dois não existir, retorna erro
        if (projeto == null || participante == null) {
            return ResponseEntity.badRequest().body("Projeto ou Participante não encontrado.");
        }

        // 3. Cria o objeto de ligação (Classe Associativa)
        VinculoParticipacao novoVinculo = new VinculoParticipacao();
        novoVinculo.setProjeto(projeto);
        novoVinculo.setParticipante(participante);
        novoVinculo.setFuncaoDesempenhada(vinculoDTO.getFuncaoDesempenhada());
        novoVinculo.setDataEntrada(LocalDate.now()); // Entrada hoje por padrão

        vinculoRepository.save(novoVinculo);
        return ResponseEntity.ok("Vínculo criado com sucesso!");
    }


    // 8. Consultar Participantes de um Projeto (Por Código Único)
    @GetMapping("/projeto/{codigo}/participantes")
    public List<Participante> listarParticipantes(@PathVariable String codigo) {
        return vinculoRepository.findParticipantesByProjetoCodigo(codigo);
    }

    // 8. Consultar Meus Projetos (Por CPF)
    @GetMapping("/participante/{cpf}/projetos")
    public List<Projeto> listarMeusProjetos(@PathVariable String cpf) {
        return vinculoRepository.findProjetosByParticipanteCpf(cpf);
    }

    // 8. Participantes em Múltiplos Projetos
    @GetMapping("/relatorios/multiplos-projetos")
    public List<Participante> listarPolivalentes() {
        return vinculoRepository.findParticipantesEmMultiplosProjetos();
    }

    // desfazer vinculo
    @DeleteMapping("/desvincular")
    public ResponseEntity<?> desfazerVinculo(
            @RequestParam String codigoProjeto,
            @RequestParam String cpfParticipante) {

        // 1. Busca o Projeto pelo Código Único
        Projeto projeto = projetoRepository.findByCodigoUnico(codigoProjeto)
                .orElse(null);

        // 2. Busca o Participante pelo CPF
        Participante participante = participanteRepository.findByCpf(cpfParticipante)
                .orElse(null);

        // Validação: Se um dos dois não existir, retorna erro
        if (projeto == null || participante == null) {
            return ResponseEntity.badRequest().body("Projeto ou Participante não encontrado.");
        }

        // 3. Busca o vínculo existente
        List<VinculoParticipacao> vinculos = vinculoRepository.findByProjeto_CodigoUnico(codigoProjeto);
        VinculoParticipacao vinculoParaRemover = null;
        for (VinculoParticipacao v : vinculos) {
            if (v.getParticipante().getCpf().equals(cpfParticipante)) {
                vinculoParaRemover = v;
                break;
            }
        }

        if (vinculoParaRemover == null) {
            return ResponseEntity.badRequest().body("Vínculo não encontrado.");
        }

        vinculoRepository.delete(vinculoParaRemover);
        return ResponseEntity.ok("Vínculo removido com sucesso!");
    }
}