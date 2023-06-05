package com.br.expocol.api.mapper;

import com.br.expocol.api.controller.response.UsuarioDetalharResponse;
import com.br.expocol.api.domain.PerfilUsuario;

public class DetalharPerfilUsuarioMapper {
    public static UsuarioDetalharResponse toResponse(PerfilUsuario entity) {
        UsuarioDetalharResponse response = new UsuarioDetalharResponse();

        response.setImagemPerfil(entity.getImagemPerfil());
        response.setEmail(entity.getUsuario().getEmail());
        response.setNome(entity.getUsuario().getNome());

        return response;
    }
}