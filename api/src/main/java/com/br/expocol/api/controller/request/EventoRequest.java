package com.br.expocol.api.controller.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class EventoRequest {

    @NotNull
    @NotBlank
    private String descricao;

    @NotNull
    @NotBlank
    private String titulo;

    private LocalTime tempo;

    private LocalDateTime dataNotificacao;

    private String schedulerName;

    private String schedulerGroup;

}
