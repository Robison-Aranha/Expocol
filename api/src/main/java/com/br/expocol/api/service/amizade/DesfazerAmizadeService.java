package com.br.expocol.api.service.amizade;

import com.br.expocol.api.controller.request.IdRequest;
import com.br.expocol.api.domain.Usuario;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DesfazerAmizadeService {


    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    UsuarioRepository usuarioRepository;

    public void desfazer(Long id) {

        UsuarioResponse usuarioId = buscarUsuarioSecurityAuthService.buscar();

        Usuario usuario = buscarUsuarioService.porId(usuarioId.getId());

        Usuario amigo = buscarUsuarioService.porId(id);

        usuario.desfazerAmizade(amigo);

        usuarioRepository.save(usuario);
    }
}