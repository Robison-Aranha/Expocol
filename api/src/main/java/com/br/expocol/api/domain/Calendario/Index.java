package com.br.expocol.api.domain.Calendario;


import com.br.expocol.api.domain.Calendario.Dia;
import jakarta.persistence.*;
import lombok.*;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Index {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_dia")
    private Dia diaIndex;

    private String indexName;

    private String indexContent;

    private String index;

}
