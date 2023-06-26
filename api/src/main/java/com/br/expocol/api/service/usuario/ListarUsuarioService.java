package com.br.expocol.api.service.usuario;

import com.br.expocol.api.controller.response.Usuario.UsuarioListaResponse;
import com.br.expocol.api.mapper.Usuario.ListarUsuarioMapper;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.VerificarParametroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ListarUsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    @Autowired
    VerificarParametroService verificarParametroUsuarioService;

    public Page<UsuarioListaResponse> listar(String nome, Pageable pageable) {

        UsuarioResponse usuarioId = buscarUsuarioSecurityAuthService.buscar();

        verificarParametroUsuarioService.verificar(nome);

        return usuarioRepository.findUsuarios(usuarioId.getId(), nome, pageable)
                .map(ListarUsuarioMapper::toResponse);

    }
}
