package com.projetoBanco.trabalho.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProducaoCientifica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String tipoProducao;
    private Integer anoPublicacao;
    private String meioDivulgacao;

    // CORREÇÃO: Impede o erro de recursividade infinita (}}}}}) no JSON
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "projeto_id")
    private Projeto projeto;

    @ManyToMany
    @JoinTable(name = "producao_autores", joinColumns = @JoinColumn(name = "producao_id"), inverseJoinColumns = @JoinColumn(name = "participante_id"))
    private List<Participante> autores;
}