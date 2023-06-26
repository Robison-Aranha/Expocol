package com.br.expocol.api.mapper.Calendario;

import com.br.expocol.api.controller.response.Calendario.IndexResponse;
import com.br.expocol.api.domain.Calendario.Index;

public class RetornarIndexesMapper {

    public static IndexResponse toResponse(Index entity) {

        return IndexResponse.builder()
                .id(entity.getId())
                .indexName(entity.getIndexName())
                .build();

    }


}
