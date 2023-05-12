package com.br.expocol.api.security.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class UsuarioRequest {

    @NotBlank
    private String nome;

    @NotNull
    @Email
    private String email;

    @NotBlank
    private String senha;

}
