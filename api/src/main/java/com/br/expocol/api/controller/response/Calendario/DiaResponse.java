package com.br.expocol.api.controller.response.Calendario;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DiaResponse {

    private String diaDaSemana;

    private Integer diaValor;

    private Boolean index;

    private Boolean event;

}
