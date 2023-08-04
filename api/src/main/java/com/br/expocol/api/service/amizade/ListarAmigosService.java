package com.br.expocol.api.service.amizade;

import com.br.expocol.api.controller.response.Usuario.UsuarioListaComplResponse;
import com.br.expocol.api.controller.response.Usuario.UsuarioListaResponse;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.mapper.Usuario.ListarUsuarioMapper;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ListarAmigosService {


    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;


    public Page<UsuarioListaComplResponse> listar() {

        Usuario usuario = usuarioAutenticadoService.get();

        List<UsuarioListaComplResponse> lista = usuario.getAmigos().stream().map(ListarUsuarioMapper::toResponseCompl).collect(Collectors.toList());

        return new PageImpl<>(lista);

    }
}