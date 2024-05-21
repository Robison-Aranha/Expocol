package com.br.expocol.api.domain.Usuario;



import jakarta.persistence.*;
import lombok.*;


import java.util.Map;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(of = "id") @ToString(of = "id")
public class Chat {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuarioChat;

    @ManyToOne
    @JoinColumn(name = "id_destinatario")
    private Usuario destinatario;

    @OneToMany(mappedBy = "chat")
    @MapKey(name = "index")
    private Map<Integer , Mensagem> usuarioMensagens;

}
