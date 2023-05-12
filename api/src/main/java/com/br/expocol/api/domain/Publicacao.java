package com.br.expocol.api.domain;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static jakarta.persistence.GenerationType.IDENTITY;


@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Publicacao {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String descricao;

    private Integer curtidas;

    @Column(name = "data_postagem")
    private LocalDateTime dataPostagem;

    private boolean privado;

    @Column(name = "imagem_publicacao")
    private String imagemPublicacao;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuarioPostagem;

    @ManyToMany
    @JoinTable(
            name = "curtidas",
            joinColumns = @JoinColumn(name = "id_publicacao"),
            inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    private List<Usuario> curtidasUsuarios = new ArrayList<>();

    @OneToMany(mappedBy = "publicacao")
    List<Comentario> comentarios = new ArrayList<>();

    public void adicionarCurtida(Usuario usuario) {

        if (Objects.isNull(this.getCurtidas())){
            this.setCurtidas(0);
        }

        this.getCurtidasUsuarios().add(usuario);
        this.setCurtidas(this.getCurtidas() + 1);
    }

    public void desfazerCurtida(Usuario usuario) {
        this.getCurtidasUsuarios().remove(usuario);
        this.setCurtidas(this.getCurtidas() - 1);
    }
}
