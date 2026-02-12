package com.projetoBanco.trabalho.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.projetoBanco.trabalho.repositories.FinanciamentoRepository;
import com.projetoBanco.trabalho.models.Financiamento;
import java.util.List;

@Service
public class FinanciamentoService {
    private final FinanciamentoRepository financiamentoRepository;

    @Autowired
    public FinanciamentoService(FinanciamentoRepository financiamentoRepository) {
        this.financiamentoRepository = financiamentoRepository;
    }

    public List<Financiamento> listarTodos() {
        return financiamentoRepository.findAll();
    }

    public Financiamento salvar(Financiamento financiamento) {
        return financiamentoRepository.save(financiamento);
    }
    
}
