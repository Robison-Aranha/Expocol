package com.br.expocol.api.security.domain;



import com.br.expocol.api.domain.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import static jakarta.persistence.GenerationType.IDENTITY;


@Entity
@Builder @AllArgsConstructor
@NoArgsConstructor @Getter @Setter @EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Permissao {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String nome;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
