package com.br.expocol.api.service.perfilUsuario;

import com.br.expocol.api.controller.response.Usuario.UsuarioDetalharResponse;
import com.br.expocol.api.domain.Usuario.PerfilUsuario;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.mapper.Usuario.PerfilUsuarioMapper;
import com.br.expocol.api.repository.Usuario.PerfilUsuarioRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
public class DetalharPerfilUsuarioService {


    @Autowired
    PerfilUsuarioRepository perfilUsuarioRepository;
    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    public UsuarioDetalharResponse detalhar() {

        Usuario usuario = usuarioAutenticadoService.get();

        PerfilUsuario perfilUsuario = usuario.getPerfilUsuario();

        if (Objects.isNull(perfilUsuario)){
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Não ha perfil ainda!");
        }

        UsuarioDetalharResponse response = PerfilUsuarioMapper.toResponse(perfilUsuario);

        return response;
    }
}
