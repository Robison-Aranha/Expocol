package com.br.expocol.api.security.service;


import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.controller.response.TokenResponse;
import com.br.expocol.api.security.jwt.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.br.expocol.api.security.mapper.UsuarioMapper.toResponse;


@Service
public class BuscarUsuarioSecurityAuthService {

    @Autowired
    private UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    JwtService jwtService;


    public TokenResponse buscar() {
        Usuario usuarioAutenticado = usuarioAutenticadoService.get();

        jwtService.deleteToken(usuarioAutenticado);

        String newToken = jwtService.generateToken(usuarioAutenticado);

        jwtService.saveToken(usuarioAutenticado, newToken);

        return toResponse(newToken,  usuarioAutenticado.getId());
    }
}
