package com.br.expocol.api.domain.Calendario;


import com.br.expocol.api.domain.Usuario.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Ano {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "ano")
    private List<Mes> meses;

    private Integer anoValue;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

}
