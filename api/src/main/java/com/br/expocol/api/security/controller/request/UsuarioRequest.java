package com.br.expocol.api.security.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class UsuarioRequest {

    @Pattern(regexp = "^[a-zA-Z0-9]{6,12}$",
            message = "Nome Invalido!")
    @NotBlank
    @NotNull
    private String nome;

    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$",
            message = "Email Invalido!")
    @NotNull
    @NotBlank
    private String email;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,12}$",
            message = "Senha Invalida!")
    @NotBlank
    @NotNull
    private String senha;

}
