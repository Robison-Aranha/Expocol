package com.br.expocol.api.mapper.Usuario;

import com.br.expocol.api.controller.response.Usuario.UsuarioListaComplResponse;
import com.br.expocol.api.controller.response.Usuario.UsuarioListaResponse;
import com.br.expocol.api.domain.Usuario.Usuario;
import org.springframework.stereotype.Service;

@Service
public class ListarUsuarioMapper {


    public static UsuarioListaResponse toResponse(Usuario entity) {

        return UsuarioListaResponse.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .imagemPerfil(entity.getPerfilUsuario().getImagemPerfil())
                .build();


    }

    public static UsuarioListaComplResponse toResponseCompl(Usuario entity) {

        return UsuarioListaComplResponse.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .nome(entity.getNome())
                .imagemPerfil(entity.getPerfilUsuario().getImagemPerfil())
                .build();


    }

}