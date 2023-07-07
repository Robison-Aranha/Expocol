package com.br.expocol.api.mapper.Calendario;

import com.br.expocol.api.controller.response.Calendario.EventoResponse;
import com.br.expocol.api.controller.response.Calendario.IndexResponse;
import com.br.expocol.api.domain.Calendario.Evento;
import com.br.expocol.api.domain.Calendario.Index;

public class RetornarIndexesEventosMapper {

    public static IndexResponse toResponseIndex(Index entity) {

        return IndexResponse.builder()
                .id(entity.getId())
                .indexName(entity.getIndexName())
                .build();

    }

    public static EventoResponse toResponseEvento(Evento entity) {

        return EventoResponse.builder()
                .id(entity.getId())
                .tempo(entity.getTempo())
                .titulo(entity.getTitulo())
                .build();

    }


}
