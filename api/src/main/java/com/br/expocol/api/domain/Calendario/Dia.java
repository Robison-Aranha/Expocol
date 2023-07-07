package com.br.expocol.api.domain.Calendario;


import com.br.expocol.api.enumerator.DiasDaSemana;
import com.fasterxml.jackson.annotation.JacksonInject;
import io.hypersistence.utils.hibernate.type.basic.PostgreSQLEnumType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Dia {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "valid_week_days")
    @Type(PostgreSQLEnumType.class)
    private DiasDaSemana diaDaSemana;

    private Integer diaValor;

    @ManyToOne
    @JoinColumn(name = "id_mes")
    private Mes mes;

    @OneToMany(mappedBy = "diaIndex")
    private List<Index> indexes = new ArrayList<>();

    @OneToMany(mappedBy = "diaEvento")
    private List<Evento> eventos = new ArrayList<>();


}
