package com.projetoBanco.trabalho.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VinculoDTO {
    
    private String codigoProjeto;
    private String cpfParticipante;
    private String funcaoDesempenhada;
}
