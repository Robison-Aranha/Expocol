package com.br.expocol.api.mapper.Usuario;


import com.br.expocol.api.controller.response.Usuario.UsuarioDetalharResponse;
import com.br.expocol.api.domain.Usuario.PerfilUsuario;



public class PerfilUsuarioMapper {
    public static UsuarioDetalharResponse toResponse(PerfilUsuario entity) {
        return UsuarioDetalharResponse.builder()
                .imagemPerfil(entity.getImagemPerfil())
                .email(entity.getUsuario().getEmail())
                .nome(entity.getUsuario().getNome())
                .build();
    }

}