package com.br.expocol.api.domain;


import jakarta.persistence.*;
import lombok.*;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class PerfilUsuario {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String descricao;

    private String apelido;

    private Integer idade;


    @Column(name = "imagem_perfil")
    private String imagemPerfil;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
}
