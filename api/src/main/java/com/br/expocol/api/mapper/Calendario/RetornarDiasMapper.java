package com.br.expocol.api.mapper.Calendario;

import com.br.expocol.api.controller.response.Calendario.DiaResponse;
import com.br.expocol.api.domain.Calendario.Dia;


public class RetornarDiasMapper {


    public static DiaResponse toResponse(Dia entity) {

        return DiaResponse.builder()
                .diaValor(entity.getDiaValor())
                .diaDaSemana(entity.getDiaDaSemana().toString())
                .index(!entity.getIndexes().isEmpty())
                .build();

    }

}
