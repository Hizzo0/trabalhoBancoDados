package com.projetoBanco.trabalho.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "producao_participante")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProducaoParticipante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Referência ao Participante pelo CPF
    @Column(name = "cpf_participante", nullable = false)
    private String cpfParticipante;

    // Referência à Produção Científica
    @ManyToOne
    @JoinColumn(name = "producao_id", nullable = false)
    private ProducaoCientifica producao;

    // Estado ativo/inativo
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

}
