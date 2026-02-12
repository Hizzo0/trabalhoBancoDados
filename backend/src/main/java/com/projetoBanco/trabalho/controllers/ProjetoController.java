package com.projetoBanco.trabalho.controllers;

import com.projetoBanco.trabalho.dto.ProjetoDTO;
import com.projetoBanco.trabalho.models.Docente;
import com.projetoBanco.trabalho.models.Financiamento;
import com.projetoBanco.trabalho.models.Projeto;
import com.projetoBanco.trabalho.repositories.ProjetoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.projetoBanco.trabalho.dto.ProjetoDTO;

import java.time.LocalDate;
import java.util.List;
import com.projetoBanco.trabalho.repositories.ParticipanteRepository;
import java.util.Optional;
import com.projetoBanco.trabalho.repositories.FinanciamentoRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/projetos") // Base da URL para projetos
public class ProjetoController {

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private ParticipanteRepository participanteRepository;

    @Autowired
    private FinanciamentoRepository financiamentoRepository;

    // 3. Criar Projeto (POST)
    // Deve ser passado o cpf do docente
    // verifica se existe um docente com o cpf passado, se existir, associa o
    // docente como coordenador do projeto
    @PostMapping
    public ResponseEntity<?> criarProjeto(@RequestBody ProjetoDTO dto) {
        // 1. Verifica se o docente existe pelo CPF
        Optional<Docente> docenteOpt = participanteRepository.findByCpf(dto.getCpfCoordenador())
                .filter(participante -> participante instanceof Docente)
                .map(participante -> (Docente) participante);

        if (docenteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Docente não encontrado com o CPF: " + dto.getCpfCoordenador());
        }

        // 2. Cria o Projeto
        Projeto novoProjeto = new Projeto();
        novoProjeto.setCodigoUnico(dto.getCodigoUnico());
        novoProjeto.setTitulo(dto.getTitulo());
        novoProjeto.setDescricao(dto.getDescricao());
        novoProjeto.setDataInicio(LocalDate.parse(dto.getDataInicio()));
        if (dto.getDataFim() != null && !dto.getDataFim().isEmpty()) {
            novoProjeto.setDataFim(LocalDate.parse(dto.getDataFim()));
        }
        novoProjeto.setSituacao(dto.getSituacao());
        novoProjeto.setCoordenador(docenteOpt.get());

        // 3. Salva o Projeto
        Projeto projetoSalvo = projetoRepository.save(novoProjeto);

        // 4. Se houver agência, busca o financiamento existente e associa
        if (dto.getAgenciaFinanciador() != null && !dto.getAgenciaFinanciador().isEmpty()) {
            Optional<Financiamento> finOpt = financiamentoRepository
                    .findByAgenciaFinanciador(dto.getAgenciaFinanciador());

            if (finOpt.isPresent()) {
                Financiamento financiamentoExistente = finOpt.get();

                // Como é OneToOne, verificamos se esse financiamento já não está em outro
                // projeto
                if (financiamentoExistente.getProjeto() != null
                        && !financiamentoExistente.getProjeto().getId().equals(projetoSalvo.getId())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("A agência '" + dto.getAgenciaFinanciador() + "' já está vinculada a outro projeto.");
                }

                projetoSalvo.setFinanciamento(financiamentoExistente);
                projetoRepository.save(projetoSalvo); // Atualiza a relação
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Agência de financiamento não encontrada: " + dto.getAgenciaFinanciador());
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(projetoSalvo);
    }

    // 3.1 Deletar Projeto por codigo unico
    // encontra o projeto pelo codigo unico e deleta
    // verifica se o projeto existe e se possui vinculos antes de deletar
    // se possui vinculos, nao deleta e solicita remover vinculos primeiro
    @DeleteMapping("/codigo/{codigo}")
    public ResponseEntity<?> deletarProjetoPorCodigoUnico(@PathVariable String codigo) {
        return projetoRepository.findByCodigoUnico(codigo)
                .map(projeto -> {
                    // Verifica se há vínculos antes de prosseguir
                    if (projeto.getVinculos() != null && !projeto.getVinculos().isEmpty()) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("Não é possível deletar: O projeto '" + codigo + "' possui vínculos ativos.");
                    }

                    projetoRepository.delete(projeto);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/meus/{cpf}")
    public List<Projeto> listarMeusProjetos(@PathVariable String cpf) {
        return projetoRepository.findByParticipanteCpf(cpf);
    }

    // 3.2 Alterar Projeto por codigo unico
    @PutMapping("/codigo/{codigo}")
    public ResponseEntity<?> atualizarProjetoPorCodigoUnico(@PathVariable String codigo, @RequestBody ProjetoDTO dto) {
        return projetoRepository.findByCodigoUnico(codigo)
                .map(projetoExistente -> {
                    // Atualiza os campos do projeto existente
                    projetoExistente.setTitulo(dto.getTitulo());
                    projetoExistente.setDescricao(dto.getDescricao());
                    projetoExistente.setDataInicio(LocalDate.parse(dto.getDataInicio()));
                    if (dto.getDataFim() != null && !dto.getDataFim().isEmpty()) {
                        projetoExistente.setDataFim(LocalDate.parse(dto.getDataFim()));
                    } else {
                        projetoExistente.setDataFim(null);
                    }
                    projetoExistente.setSituacao(dto.getSituacao());

                    // Atualiza o coordenador se o CPF for diferente
                    if (!projetoExistente.getCoordenador().getCpf().equals(dto.getCpfCoordenador())) {
                        Optional<Docente> novoCoordenadorOpt = participanteRepository.findByCpf(dto.getCpfCoordenador())
                                .filter(participante -> participante instanceof Docente)
                                .map(participante -> (Docente) participante);

                        if (novoCoordenadorOpt.isEmpty()) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body("Docente não encontrado com o CPF: " + dto.getCpfCoordenador());
                        }
                        projetoExistente.setCoordenador(novoCoordenadorOpt.get());
                    }

                    // Atualiza o financiamento se fornecido
                    if (dto.getAgenciaFinanciador() != null && !dto.getAgenciaFinanciador().isEmpty()) {
                        Optional<Financiamento> finOpt = financiamentoRepository
                                .findByAgenciaFinanciador(dto.getAgenciaFinanciador());

                        if (finOpt.isPresent()) {
                            Financiamento financiamentoExistente = finOpt.get();

                            // Verifica se esse financiamento já não está em outro projeto
                            if (financiamentoExistente.getProjeto() != null
                                    && !financiamentoExistente.getProjeto().getId().equals(projetoExistente.getId())) {
                                return ResponseEntity.status(HttpStatus.CONFLICT)
                                        .body("A agência '" + dto.getAgenciaFinanciador()
                                                + "' já está vinculada a outro projeto.");
                            }

                            projetoExistente.setFinanciamento(financiamentoExistente);
                        } else {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body("Agência de financiamento não encontrada: " + dto.getAgenciaFinanciador());
                        }
                    }

                    // Salva as alterações
                    Projeto projetoAtualizado = projetoRepository.save(projetoExistente);
                    return ResponseEntity.ok(projetoAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Listar todos os projetos
    @GetMapping
    public List<Projeto> listarTodos() {
        return projetoRepository.findAll();
    }

    // buscar projeto por codigo unico
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Projeto> buscarPorCodigoUnico(@PathVariable String codigo) {
        return projetoRepository.findByCodigoUnico(codigo)
                .map(projeto -> ResponseEntity.ok().body(projeto))
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscar um projeto específico pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Projeto> buscarPorId(@PathVariable Long id) {
        return projetoRepository.findById(id)
                .map(projeto -> ResponseEntity.ok().body(projeto))
                .orElse(ResponseEntity.notFound().build());
    }
}