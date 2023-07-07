package com.br.expocol.api.controller.response.Calendario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventoContentResponse {


    private String titulo;

    private String descricao;

    private LocalTime tempo;

    private LocalDateTime dataNotificacao;

}
