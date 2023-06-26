package com.br.expocol.api.service.amizade;

import com.br.expocol.api.controller.response.Usuario.UsuarioListaResponse;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.mapper.Usuario.ListarUsuarioMapper;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListarAmigosService {


    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;


    public Page<UsuarioListaResponse> listar() {

        UsuarioResponse usuarioid = buscarUsuarioSecurityAuthService.buscar();

        Usuario usuario = buscarUsuarioService.porId(usuarioid.getId());

        List<UsuarioListaResponse> lista = usuario.getAmigos().stream().map(ListarUsuarioMapper::toResponse).collect(Collectors.toList());

        return new PageImpl<>(lista);

    }
}