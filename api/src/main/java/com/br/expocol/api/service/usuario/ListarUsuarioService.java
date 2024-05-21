package com.br.expocol.api.service.usuario;

import com.br.expocol.api.controller.response.Usuario.UsuarioListaComplResponse;
import com.br.expocol.api.mapper.Usuario.ListarUsuarioMapper;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
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
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    VerificarParametroService verificarParametroUsuarioService;

    public Page<UsuarioListaComplResponse> listar(String nome, Pageable pageable) {

        Long usuarioId = usuarioAutenticadoService.getId();

        return usuarioRepository.findUsuarios(usuarioId, nome, pageable)
                .map(ListarUsuarioMapper::toResponseCompl);

    }
}
