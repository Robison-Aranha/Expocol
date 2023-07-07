package com.br.expocol.api.security.domain;


import com.br.expocol.api.domain.Usuario.Usuario;
import jakarta.persistence.*;
import lombok.*;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Token {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String token;

    private Boolean IsExpired;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    Usuario usuarioToken;

}
