package com.projetoBanco.trabalho.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Projeto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String codigoUnico;

    private String titulo;

    @Column(length = 1000) // Descrições costumam ser longas
    private String descricao;

    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String situacao;

    // Relacionamento 1:N (Um docente coordena vários projetos)
    @ManyToOne
    @JoinColumn(name = "coordenador_id")
    private Docente coordenador;

    // Relacionamento 0..1 com Financiamento (conforme o diagrama "apoia")
    @OneToOne
    @JoinColumn(name = "financiamento_id")
    private Financiamento financiamento;

    // Relacionamento com a classe associativa
    @OneToMany(mappedBy = "projeto")
    @JsonManagedReference
    private List<VinculoParticipacao> vinculos;

    // Relacionamento com Produção Científica
    @OneToMany(mappedBy = "projeto")
    @JsonManagedReference
    private List<ProducaoCientifica> producoes;
}