package com.br.expocol.api.controller.response.Calendario;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventoResponse {

    private Long id;

    private String titulo;

    private LocalTime tempo;

}
