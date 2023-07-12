package com.br.expocol.api.security.mapper;

import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.controller.request.UsuarioRequest;
import com.br.expocol.api.security.controller.response.TokenResponse;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.domain.Permissao;

import java.util.List;

import static java.util.stream.Collectors.toList;

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

    private static List<String> buildPermissoesResponse(List<Permissao> permissoes) {
        return permissoes.stream()
                .map(Permissao::getNome)
                .collect(toList());
    }
}
