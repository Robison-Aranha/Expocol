package com.br.expocol.api.controller.response.Usuario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioListaResponse {

    private Long id;
    private String nome;
    private String imagemPerfil;
}