package com.br.expocol.api.service.usuario;


import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.Calendario.RetornarEventoContentService;
import com.br.expocol.api.service.Index.RetornarArquivoConvertidoService;
import jakarta.transaction.Transactional;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@Service

public class AtualizarImagemUsuario {


    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    RetornarArquivoConvertidoService retornarArquivoConvertidoService;

    @Autowired
    UsuarioRepository usuarioRepository;

    public void atualizar(MultipartFile arquivo) throws IOException {

        Usuario usuario = usuarioAutenticadoService.get();

        if (arquivo != null) {

            String arquivoConvertido = retornarArquivoConvertidoService.converter(arquivo);

            usuario.getPerfilUsuario().setImagemPerfil(arquivoConvertido);

            usuarioRepository.save(usuario);
        }
    }
}
