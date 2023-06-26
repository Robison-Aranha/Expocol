package com.br.expocol.api.domain.Calendario;


import com.br.expocol.api.enumerator.MesesDoAno;
import io.hypersistence.utils.hibernate.type.basic.PostgreSQLEnumType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Mes {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_ano")
    private Ano ano;

    @OneToMany(mappedBy = "mes")
    private List<Dia> dias;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "valid_months")
    @Type(PostgreSQLEnumType.class)
    private MesesDoAno mes;

}
