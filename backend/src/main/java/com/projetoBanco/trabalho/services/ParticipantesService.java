package com.projetoBanco.trabalho.services;

import com.projetoBanco.trabalho.models.Participante;
import com.projetoBanco.trabalho.repositories.ParticipanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParticipantesService {

    private final ParticipanteRepository repository;

    @Autowired
    public ParticipantesService(ParticipanteRepository repository) {
        this.repository = repository;
    }

    public void deletarPorCpf(String cpf) {
        if (!repository.existsByCpf(cpf)) {
            throw new RuntimeException("Participante não encontrado com o CPF: " + cpf);
        }
        repository.deleteByCpf(cpf);
    }

    public Participante buscarPorCpf(String cpf) {
        return repository.findByCpf(cpf).orElseThrow(() ->
                new RuntimeException("Participante não encontrado com o CPF: " + cpf)
        );
    }

    public Participante salvarParticipante(Participante participante) {
        return repository.save(participante);
    }


}