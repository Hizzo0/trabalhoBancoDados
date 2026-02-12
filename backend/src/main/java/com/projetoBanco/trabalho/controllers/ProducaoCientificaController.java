package com.projetoBanco.trabalho.controllers;

import com.projetoBanco.trabalho.models.ProducaoCientifica;
import com.projetoBanco.trabalho.models.ProducaoParticipante;
import com.projetoBanco.trabalho.models.Projeto;
import com.projetoBanco.trabalho.repositories.ProducaoCientificaRepository;
import com.projetoBanco.trabalho.repositories.ProducaoParticipanteRepository;
import com.projetoBanco.trabalho.repositories.ProjetoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/producoes")
public class ProducaoCientificaController {

    @Autowired
    private ProducaoCientificaRepository producaoCientificaRepository;

    @Autowired
    private ProducaoParticipanteRepository producaoParticipanteRepository;

    @Autowired
    private ProjetoRepository projetoRepository;

    // --- CORREÇÃO: Método para listar todas (GET /api/producoes) ---
    @GetMapping
    public List<ProducaoCientifica> listarTodas() {
        return producaoCientificaRepository.findAll();
    }

    // 1. Criar uma Produção Científica (POST)
    @PostMapping
    public ResponseEntity<?> criarProducao(
            @RequestBody ProducaoCientifica producao,
            @RequestParam String cpfParticipante,
            @RequestParam String codigoProjeto) {

        Projeto projeto = projetoRepository.findByCodigoUnico(codigoProjeto).orElse(null);

        if (projeto == null) {
            return ResponseEntity.badRequest().body("Projeto não encontrado");
        }

        producao.setProjeto(projeto);
        ProducaoCientifica producaoSalva = producaoCientificaRepository.save(producao);

        // Associa participante à produção (UC08)
        ProducaoParticipante producaoParticipante = new ProducaoParticipante();
        producaoParticipante.setCpfParticipante(cpfParticipante);
        producaoParticipante.setProducao(producaoSalva);
        producaoParticipante.setAtivo(true);
        producaoParticipanteRepository.save(producaoParticipante);

        return ResponseEntity.ok(producaoSalva);
    }

    // 2. Deletar Produção (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProducao(@PathVariable Long id) {
        if (!producaoCientificaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        producaoCientificaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 3. Buscar por Título (GET /api/producoes/busca)
    @GetMapping("/busca")
    public ResponseEntity<List<ProducaoCientifica>> buscarPorTitulo(@RequestParam String titulo) {
        List<ProducaoCientifica> producoes = producaoCientificaRepository.findByTituloContainingIgnoreCase(titulo);
        return ResponseEntity.ok(producoes);
    }

    // 4. Buscar por CPF do Participante
    @GetMapping("/participante/{cpf}")
    public ResponseEntity<List<ProducaoCientifica>> buscarProducoesPorCpfParticipante(@PathVariable String cpf) {
        List<ProducaoParticipante> producaoParticipantes = producaoParticipanteRepository.findByCpfParticipante(cpf);
        List<ProducaoCientifica> producoes = producaoParticipantes.stream()
                .map(ProducaoParticipante::getProducao)
                .collect(Collectors.toList());
        return ResponseEntity.ok(producoes);
    }
}