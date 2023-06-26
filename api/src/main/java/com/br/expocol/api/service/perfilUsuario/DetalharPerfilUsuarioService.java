package com.br.expocol.api.service.perfilUsuario;

import com.br.expocol.api.controller.response.Usuario.UsuarioDetalharResponse;
import com.br.expocol.api.domain.Usuario.PerfilUsuario;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.mapper.Usuario.DetalharPerfilUsuarioMapper;
import com.br.expocol.api.repository.Usuario.PerfilUsuarioRepository;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
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
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    public UsuarioDetalharResponse detalhar() {

        UsuarioResponse usuarioId = buscarUsuarioSecurityAuthService.buscar();

        Usuario usuario = buscarUsuarioService.porId(usuarioId.getId());

        PerfilUsuario perfilUsuario = usuario.getPerfilUsuario();

        if (Objects.isNull(perfilUsuario)){
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Não ha perfil ainda!");
        }

        UsuarioDetalharResponse response = DetalharPerfilUsuarioMapper.toResponse(perfilUsuario);

        return response;
    }
}
