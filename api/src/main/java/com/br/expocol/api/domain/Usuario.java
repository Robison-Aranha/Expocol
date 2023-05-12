package com.br.expocol.api.domain;


import com.br.expocol.api.security.domain.Permissao;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter @EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Usuario {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;
    private boolean ativo;

    @OneToOne(mappedBy = "usuario")
    private PerfilUsuario perfilUsuario;

    @OneToMany(mappedBy = "usuarioPostagem")
    private List<Publicacao> publicacoes;

    @ManyToMany
    @JoinTable(
            name = "amigos",
            joinColumns = @JoinColumn(name = "id_usuario1"),
            inverseJoinColumns = @JoinColumn(name = "id_usuario2")
    )
    private List<Usuario> amigos = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "solicitacao_amizade",
            joinColumns = @JoinColumn(name = "id_usuario2"),
            inverseJoinColumns = @JoinColumn(name = "id_usuario1")
    )
    private List<Usuario> solicitacoes = new ArrayList<>();

    @OneToMany(mappedBy = "usuarioComentario")
    List<Comentario> comentarios = new ArrayList<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Permissao> permissoes = new ArrayList<>();

    public void adicionarPermissao(Permissao permissao) {
        this.permissoes.add(permissao);
        permissao.setUsuario(this);
    }

    public void adicionarAmigo(Usuario amigo) {
        this.amigos.add(amigo);
        amigo.amigos.add(this);
    }

    public void adicionarSolicitacao(Usuario usuario) {
        this.solicitacoes.add(usuario);
    }

    public void retirarSolicitacao(Usuario amigo) {
        this.getSolicitacoes().remove(amigo);
    }

    public void desfazerAmizade(Usuario amigo) {
        this.getAmigos().remove(amigo);
        amigo.getAmigos().remove(this);
    }

    public void desfazerSolicitacao(Usuario amigo) {
        amigo.getSolicitacoes().remove(this);
    }
}
