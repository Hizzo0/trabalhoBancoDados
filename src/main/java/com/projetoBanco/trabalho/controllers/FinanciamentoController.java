package com.projetoBanco.trabalho.controllers;

import com.projetoBanco.trabalho.models.Financiamento;
import com.projetoBanco.trabalho.repositories.FinanciamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/financiamentos")
public class FinanciamentoController {

    @Autowired
    private FinanciamentoRepository financiamentoRepository;

    // 4. Cadastrar Financiamento (POST)
    @PostMapping
    public Financiamento salvar(@RequestBody Financiamento financiamento) {
        return financiamentoRepository.save(financiamento);
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

    // 4.2 Alterar Financiamento por codigo unico do projeto
    @PutMapping("/projeto/codigo/{codigo}")
    public ResponseEntity<Financiamento> atualizarFinanciamentoPorCodigoProjeto(@PathVariable String codigo, @RequestBody Financiamento dadosAtualizados) {
        List<Financiamento> financiamentos = financiamentoRepository.findByProjeto_CodigoUnico(codigo);
        if (financiamentos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Supondo que só exista um financiamento por projeto
        Financiamento financiamentoExistente = financiamentos.get(0);
        financiamentoExistente.setAgenciaFinanciador(dadosAtualizados.getAgenciaFinanciador());
        financiamentoExistente.setValorTotal(dadosAtualizados.getValorTotal());
        financiamentoExistente.setTipoFomento(dadosAtualizados.getTipoFomento());

        Financiamento financiamentoAtualizado = financiamentoRepository.save(financiamentoExistente);
        return ResponseEntity.ok(financiamentoAtualizado);
    }




    // Listar todos os financiamentos
    @GetMapping
    public List<Financiamento> listarTodos() {
        return financiamentoRepository.findAll();
    }

}


