package com.br.expocol.api.domain.Calendario;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Evento {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String descricao;

    private String titulo;

    private LocalTime tempo;

    private LocalDateTime dataNotificacao;

    private String schedulerName;

    private String schedulerGroup;

    @ManyToOne
    @JoinColumn(name = "id_dia")
    private Dia diaEvento;

}
