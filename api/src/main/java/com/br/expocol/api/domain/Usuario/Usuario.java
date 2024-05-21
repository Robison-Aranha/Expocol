package com.br.expocol.api.domain.Usuario;

import com.br.expocol.api.security.domain.Permissao;
import com.br.expocol.api.security.domain.Token;
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

    @Column(unique = true)
    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;

    private boolean ativo;

    @OneToOne(mappedBy = "usuario")
    private PerfilUsuario perfilUsuario;

    @OneToMany(mappedBy = "usuarioChat")
    private List<Chat> chats = new ArrayList<>();
    
    @OneToOne(mappedBy = "usuarioToken")
    private Token token;
    

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Permissao> permissoes = new ArrayList<>();

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


    @ManyToMany
    @JoinTable(
            name = "amigos_bloqueados",
            joinColumns = @JoinColumn(name = "id_usuario1"),
            inverseJoinColumns = @JoinColumn(name = "id_usuario2")
    )
    private List<Usuario> usuarioBloqueados = new ArrayList<>();

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

    public List<Chat> desfazerAmizade(Usuario amigo) {

        Chat usuarioChat = amigo.getChats().stream().filter(chat -> chat.getDestinatario().getId() == this.getId()).findAny().get();
        Chat amigoChat = this.getChats().stream().filter(chat -> chat.getDestinatario().getId() == amigo.getId()).findAny().get();

        amigo.getChats().remove(usuarioChat);
        this.getChats().remove(amigoChat);

        this.getAmigos().remove(amigo);
        amigo.getAmigos().remove(this);

        List<Chat> listaChat = new ArrayList<>();
        listaChat.add(usuarioChat);
        listaChat.add(amigoChat);

        return listaChat;
    }

    public void desfazerSolicitacao(Usuario amigo) {
        amigo.getSolicitacoes().remove(this);
    }

}
