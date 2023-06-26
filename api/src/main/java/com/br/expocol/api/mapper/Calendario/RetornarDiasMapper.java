package com.br.expocol.api.mapper.Calendario;

import com.br.expocol.api.controller.response.Calendario.CalendarioResponse;
import com.br.expocol.api.controller.response.Calendario.DiaResponse;
import com.br.expocol.api.domain.Calendario.Dia;

import java.util.stream.Collectors;


public class RetornarDiasMapper {


    public static DiaResponse toResponse(Dia entity) {

        return DiaResponse.builder()
                .diaValue(entity.getDiaValor())
                .diaDaSemana(entity.getDiaDaSemana().toString())
                .index(!entity.getIndexes().isEmpty())
                .build();

    }

}
