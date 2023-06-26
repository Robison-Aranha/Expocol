package com.br.expocol.api.domain.Usuario;



import jakarta.persistence.*;
import lombok.*;

import java.util.HashMap;
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
    private Usuario usuario;

    @OneToOne
    @JoinColumn(name = "id_destinatario")
    private Usuario destinatario;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "chat", cascade = CascadeType.ALL)
    @MapKey(name = "index")
    private Map<Integer , Mensagem> usuarioMensagens = new HashMap();

}
