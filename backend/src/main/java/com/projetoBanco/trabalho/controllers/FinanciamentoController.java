package com.projetoBanco.trabalho.controllers;

import com.projetoBanco.trabalho.models.Financiamento;
import com.projetoBanco.trabalho.models.Projeto;
import com.projetoBanco.trabalho.repositories.FinanciamentoRepository;
import com.projetoBanco.trabalho.repositories.ProjetoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/financiamentos")
public class FinanciamentoController {

    @Autowired
    private FinanciamentoRepository financiamentoRepository;

    @Autowired
    private ProjetoRepository projetoRepository;

    // UC04 - Cadastrar Financiamento
    @PostMapping
    public ResponseEntity<Financiamento> salvar(@RequestBody Financiamento financiamento) {
        Financiamento salvo = financiamentoRepository.save(financiamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // UC07 - Vincular Financiamento a Projeto
    @PostMapping("/{id}/vincular/{idProjeto}")
    public ResponseEntity<?> vincular(@PathVariable Long id, @PathVariable Long idProjeto) {
        return financiamentoRepository.findById(id).map(financiamento -> {
            return projetoRepository.findById(idProjeto).map(projeto -> {
                // Como Projeto tem @JoinColumn(name = "financiamento_id"), ele é o owner.
                projeto.setFinanciamento(financiamento);
                projetoRepository.save(projeto); // Persiste a FK no banco de dados
                return ResponseEntity.ok().build();
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Projeto não encontrado"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Financiamento não encontrado"));
    }

    // Listar todos os financiamentos
    @GetMapping
    public List<Financiamento> listarTodos() {
        return financiamentoRepository.findAll();
    }

    // Excluir Financiamento por ID (Correção do erro de exclusão)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Optional<Financiamento> finanOpt = financiamentoRepository.findById(id);

        if (finanOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // UC10 - Gerenciar vínculos antes de excluir
        // Busca se existe algum projeto que utiliza este financiamento
        Projeto projetoVinculado = finanOpt.get().getProjeto();
        if (projetoVinculado != null) {
            // Como Projeto é o dono (@JoinColumn), precisamos limpar o campo nele
            projetoVinculado.setFinanciamento(null);
            projetoRepository.save(projetoVinculado);
        }

        financiamentoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 4.1 Deletar Financiamento por projeto codigo unico
    @DeleteMapping("/projeto/codigo/{codigo}")
    public ResponseEntity<Void> deletarFinanciamentoPorCodigoProjeto(@PathVariable String codigo) {
        List<Financiamento> financiamentos = financiamentoRepository.findByProjeto_CodigoUnico(codigo);
        if (financiamentos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        financiamentoRepository.deleteAll(financiamentos);
        return ResponseEntity.noContent().build();
    }

    // 4.2 Alterar Financiamento (Com correção de Datas)
    @PutMapping("/projeto/codigo/{codigo}")
    public ResponseEntity<Financiamento> atualizarFinanciamentoPorCodigoProjeto(
            @PathVariable String codigo,
            @RequestBody Financiamento dadosAtualizados) {

        List<Financiamento> financiamentos = financiamentoRepository.findByProjeto_CodigoUnico(codigo);
        if (financiamentos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Financiamento existente = financiamentos.get(0);
        existente.setAgenciaFinanciador(dadosAtualizados.getAgenciaFinanciador());
        existente.setValorTotal(dadosAtualizados.getValorTotal());
        existente.setTipoFomento(dadosAtualizados.getTipoFomento());

        // Atualização dos campos de vigência (UC04)
        existente.setPeriodoVigenciaInicio(dadosAtualizados.getPeriodoVigenciaInicio());
        existente.setPeriodoVigenciaFim(dadosAtualizados.getPeriodoVigenciaFim());

        return ResponseEntity.ok(financiamentoRepository.save(existente));
    }
}