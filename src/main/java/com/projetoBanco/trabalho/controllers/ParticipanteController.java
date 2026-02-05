package com.projetoBanco.trabalho.controllers;

import com.projetoBanco.trabalho.models.*;
import com.projetoBanco.trabalho.repositories.ParticipanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/participantes")
public class ParticipanteController {

    @Autowired
    private ParticipanteRepository participanteRepository;

    // 2. Cadastrar Docente
    @PostMapping("/docentes")
    public Docente salvarDocente(@RequestBody Docente docente) {
        return participanteRepository.save(docente);
    }

    // 2.1 Remover Docente por CPF
    @DeleteMapping("/docentes/cpf/{cpf}")
    public ResponseEntity<Void> deletarDocentePorCpf(@PathVariable String cpf) {
        if (!participanteRepository.existsByCpf(cpf)) {
            return ResponseEntity.notFound().build();
        }
        participanteRepository.deleteByCpf(cpf);
        return ResponseEntity.noContent().build();
    }


    // 2.2 Alterar Docente por CPF
    // o metodo setDepartamento deve ser criado na classe Docente
    // econtre o participante pelo cpf, faça o cast para Docente e atualize os campos
    // use o service save para salvar as alterações e alterar
    @PutMapping("/docentes/cpf/{cpf}")
    public ResponseEntity<Docente> atualizarDocentePorCpf(@PathVariable String cpf, @RequestBody Docente dadosAtualizados) {
        return participanteRepository.findByCpf(cpf)
                .map(participante -> {
                    Docente docenteExistente = (Docente) participante;
                    docenteExistente.setNome(dadosAtualizados.getNome());
                    docenteExistente.setEmail(dadosAtualizados.getEmail());
                    docenteExistente.setDepartamento(dadosAtualizados.getDepartamento());
                    // Adicione outros campos conforme necessário

                    Docente docenteAtualizado = participanteRepository.save(docenteExistente);
                    return ResponseEntity.ok(docenteAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 2.4 Cadastrar Discente
    @PostMapping("/discentes")
    public Discente salvarDiscente(@RequestBody Discente discente) {
        return participanteRepository.save(discente);
    }


    // 2.5 Deletar Discente por CPF
    @DeleteMapping("/discentes/cpf/{cpf}")
    public ResponseEntity<Void> deletarDiscentePorCpf(@PathVariable String cpf) {
        if (!participanteRepository.existsByCpf(cpf)) {
            return ResponseEntity.notFound().build();
        }
        participanteRepository.deleteByCpf(cpf);
        return ResponseEntity.noContent().build();
    }

    // 2.6 Alterar Discente por CPF
    @PutMapping("/discentes/cpf/{cpf}")
    public ResponseEntity<Discente> atualizarDiscentePorCpf(@PathVariable String cpf, @RequestBody Discente dadosAtualizados) {
        return participanteRepository.findByCpf(cpf)
                .map(participante -> {
                    Discente discenteExistente = (Discente) participante;
                    discenteExistente.setNome(dadosAtualizados.getNome());
                    discenteExistente.setEmail(dadosAtualizados.getEmail());
                    discenteExistente.setMatricula(dadosAtualizados.getMatricula());
                    // Adicione outros campos conforme necessário

                    Discente discenteAtualizado = participanteRepository.save(discenteExistente);
                    return ResponseEntity.ok(discenteAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }


    // 2.7 Cadastrar Técnico-Administrativo
    @PostMapping("/tecnicos")
    public Tecnico salvarTecnico(@RequestBody Tecnico tecnico) {
        return participanteRepository.save(tecnico);
    }

    // 2.8 Deletar Técnico-Administrativo por CPF
    @DeleteMapping("/tecnicos/cpf/{cpf}")
    public ResponseEntity<Void> deletarTecnicoPorCpf(@PathVariable String cpf) {
        if (!participanteRepository.existsByCpf(cpf)) {
            return ResponseEntity.notFound().build();
        }
        participanteRepository.deleteByCpf(cpf);
        return ResponseEntity.noContent().build();
    }

    // 2.9 Alterar Técnico-Administrativo por CPF
    @PutMapping("/tecnicos/cpf/{cpf}")
    public ResponseEntity<Tecnico> atualizarTecnicoPorCpf(@PathVariable String cpf, @RequestBody Tecnico dadosAtualizados) {
        return participanteRepository.findByCpf(cpf)
                .map(participante -> {
                    Tecnico tecnicoExistente = (Tecnico) participante;
                    tecnicoExistente.setNome(dadosAtualizados.getNome());
                    tecnicoExistente.setEmail(dadosAtualizados.getEmail());
                    tecnicoExistente.setCargo(dadosAtualizados.getCargo());
                    // Adicione outros campos conforme necessário

                    Tecnico tecnicoAtualizado = participanteRepository.save(tecnicoExistente);
                    return ResponseEntity.ok(tecnicoAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }


    // Listar todos os participantes (de qualquer tipo)
    @GetMapping
    public List<Participante> listarTodos() {
        return participanteRepository.findAll();
    }

    // Buscar por CPF
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Participante> buscarPorCpf(@PathVariable String cpf) {
        return participanteRepository.findByCpf(cpf)
                .map(p -> ResponseEntity.ok(p))
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar por CPF
    @DeleteMapping("/cpf/{cpf}")
    public ResponseEntity<Void> deletarPorCpf(@PathVariable String cpf) {
        if (!participanteRepository.existsByCpf(cpf)) {
            return ResponseEntity.notFound().build();
        }
        participanteRepository.deleteByCpf(cpf);
        return ResponseEntity.noContent().build();
    }
}