package com.br.expocol.api.security.mapper;

import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.controller.request.UsuarioRequest;
import com.br.expocol.api.security.controller.response.TokenResponse;



public class UsuarioMapper {

    public static Usuario toEntity(UsuarioRequest request) {
        Usuario entity = new Usuario();
        entity.setNome(request.getNome());
        entity.setEmail(request.getEmail());
        return entity;
    }

    public static TokenResponse toResponse(String token, Long id) {
        return TokenResponse.builder()
                .token(token)
                .id(id)
                .build();
    }
}
