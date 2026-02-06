package com.projetoBanco.trabalho.models;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tecnico extends Participante {
    private String cargo;
}