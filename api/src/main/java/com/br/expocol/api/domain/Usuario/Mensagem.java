package com.br.expocol.api.domain.Usuario;

import jakarta.persistence.*;
import lombok.*;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(unique = true)
    private Integer index;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @OneToOne
    @JoinColumn(name = "id_destinatario")
    private Usuario destinatario;

    @ManyToOne
    @JoinColumn(name = "id_chat")
    private Chat chat;

    private String Mensagem;

    @OneToOne
    @JoinColumn(name = "id_anexo")
    private Anexo anexo;

}
