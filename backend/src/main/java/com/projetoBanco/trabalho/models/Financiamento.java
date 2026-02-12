package com.projetoBanco.trabalho.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Financiamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String agenciaFinanciador;
    private String tipoFomento;
    private Double valorTotal;

    // ADICIONE ESTES CAMPOS PARA AS DATAS FUNCIONAREM
    private LocalDate periodoVigenciaInicio;
    private LocalDate periodoVigenciaFim;
    @JsonIgnore
    @OneToOne(mappedBy = "financiamento")
    private Projeto projeto;
}