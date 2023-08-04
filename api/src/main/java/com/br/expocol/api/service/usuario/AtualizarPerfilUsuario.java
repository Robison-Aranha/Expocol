package com.br.expocol.api.service.usuario;

import com.br.expocol.api.controller.request.UsuarioAtualizarRequest;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.Index.RetornarArquivoConvertidoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service

public class AtualizarPerfilUsuario {

    @Autowired
    RetornarArquivoConvertidoService retornarArquivoConvertidoService;

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    UsuarioRepository usuarioRepository;


    public void atualizar(UsuarioAtualizarRequest request) {

        Usuario usuario = usuarioAutenticadoService.get();

        if (request.getNome() != null && !request.getNome().isEmpty()) {
            usuario.setNome(request.getNome());
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            usuario.setEmail(request.getEmail());

        }

        usuarioRepository.save(usuario);
    }
}
