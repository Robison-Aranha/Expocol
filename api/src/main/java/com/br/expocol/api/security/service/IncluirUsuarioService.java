package com.br.expocol.api.security.service;


import com.br.expocol.api.domain.Usuario.PerfilUsuario;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.repository.Usuario.PerfilUsuarioRepository;
import com.br.expocol.api.security.controller.request.UsuarioRequest;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.domain.Permissao;
import com.br.expocol.api.security.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import static com.br.expocol.api.security.mapper.UsuarioMapper.toEntity;
import static com.br.expocol.api.security.mapper.UsuarioMapper.toResponse;

@Service
public class IncluirUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilUsuarioRepository perfilUsuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioResponse incluir(UsuarioRequest request) {

        Usuario usuario = toEntity(request);
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setAtivo(true);

        PerfilUsuario perfil = new PerfilUsuario();

        perfil.setUsuario(usuario);

        usuario.adicionarPermissao(Permissao.builder().nome("USUARIO").build());

        usuarioRepository.save(usuario);

        perfilUsuarioRepository.save(perfil);

        return toResponse(usuario);
    }
}
