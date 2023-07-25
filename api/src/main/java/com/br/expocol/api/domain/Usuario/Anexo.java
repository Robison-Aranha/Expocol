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
public class Anexo {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String anexoName;

    private String anexo;

    private String anexoContent;

    @OneToOne(mappedBy = "anexo")
    private Mensagem mensagem;
}
