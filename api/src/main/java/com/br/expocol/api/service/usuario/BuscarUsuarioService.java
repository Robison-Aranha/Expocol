package com.br.expocol.api.service.usuario;

import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.exception.UserNotFound;
import com.br.expocol.api.security.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class BuscarUsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    public Usuario porId(Long idUsuario) {

        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UserNotFound());

    }

    public Usuario porNome(String nome) {

        return usuarioRepository.findByNome(nome)
                .orElseThrow(() -> new UserNotFound());


    }

    public Usuario porEmail(String email) {

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFound());
    }
}
