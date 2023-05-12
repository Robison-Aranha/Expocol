package com.br.expocol.api.domain;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Comentario {


    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String comentario;

    @Column(name = "data_postagem")
    private LocalDateTime dataPostagem;

    @ManyToOne
    @JoinColumn(name = "id_publicacao")
    private Publicacao publicacao;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuarioComentario;
}
