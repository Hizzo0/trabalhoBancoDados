package com.projetoBanco.trabalho.controllers;

import com.projetoBanco.trabalho.models.Projeto;
import com.projetoBanco.trabalho.repositories.ProjetoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/projetos") // Base da URL para projetos                               
public class ProjetoController {

    @Autowired
    private ProjetoRepository projetoRepository;

    // 3. Cadastrar Projeto (POST)
    @PostMapping
    public Projeto salvar(@RequestBody Projeto projeto) {
        return projetoRepository.save(projeto);
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


    // 3.2 Alterar Projeto por codigo unico
    @PutMapping("/codigo/{codigo}")
    public ResponseEntity<Projeto> atualizarProjetoPorCodigoUnico(@PathVariable String codigo, @RequestBody Projeto dadosAtualizados) {
        return projetoRepository.findByCodigoUnico(codigo)
                .map(projetoExistente -> {
                    projetoExistente.setTitulo(dadosAtualizados.getTitulo());
                    projetoExistente.setDescricao(dadosAtualizados.getDescricao());
                    projetoExistente.setDataInicio(dadosAtualizados.getDataInicio());
                    projetoExistente.setDataFim(dadosAtualizados.getDataFim());
                    projetoExistente.setSituacao(dadosAtualizados.getSituacao());
                    projetoExistente.setCoordenador(dadosAtualizados.getCoordenador());
                    projetoExistente.setFinanciamento(dadosAtualizados.getFinanciamento());
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