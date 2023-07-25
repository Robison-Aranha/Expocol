package com.br.expocol.api.security.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class UsuarioRequest {

    @Pattern(regexp = "^[a-zA-Z0-9]{6,12}$",
            message = "username must be of 6 to 12 length with no special characters")
    @NotBlank
    @NotNull
    private String nome;

    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$",
            message = "email must not contain special characters and have to be valid")
    @NotNull
    @NotBlank
    @Email
    private String email;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,12}$",
            message = "password must be min 4 and max 12 length containing atleast 1 uppercase, 1 lowercase, 1 special character and 1 digit")
    @NotBlank
    @NotNull
    private String senha;

}
