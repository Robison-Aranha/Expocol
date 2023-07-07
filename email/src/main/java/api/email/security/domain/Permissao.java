package api.email.security.domain;



import api.email.domain.Usuario;
import jakarta.persistence.*;
import lombok.*;

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
