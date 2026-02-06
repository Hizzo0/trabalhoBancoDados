package com.projetoBanco.trabalho.dto;

import lombok.Data;

@Data
public class ProjetoDTO {
    // Campos do Projeto
    private String codigoUnico;
    private String titulo;
    private String descricao;
    private String situacao;
    private String dataInicio;
    private String dataFim;
    
    // Campo do Docente
    private String cpfCoordenador;
    
    // Campo do Financiamento
    private String agenciaFinanciador;

    // Getters e Setters (ou use @Data do Lombok)
}