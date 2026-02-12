package com.projetoBanco.trabalho.models;
import jakarta.persistence.Entity;
import lombok.*;


@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Discente extends Participante {
    private String matricula;
}
