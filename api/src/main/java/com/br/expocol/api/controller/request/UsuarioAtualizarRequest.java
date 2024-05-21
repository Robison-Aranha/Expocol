package com.br.expocol.api.controller.request;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioAtualizarRequest {


    private String nome;


    private String email;
}
