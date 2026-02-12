package com.projetoBanco.trabalho.models;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED) // Estratégia correta para tabelas por subclasse
public abstract class Participante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;

    @Column(name = "cpf", unique = true, nullable = false)
    private String cpf;

    private String senha;
}

