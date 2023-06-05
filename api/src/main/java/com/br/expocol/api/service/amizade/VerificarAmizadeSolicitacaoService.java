package com.br.expocol.api.service.amizade;

import com.br.expocol.api.domain.Usuario;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VerificarAmizadeSolicitacaoService {

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    public Integer verificar(Long id) {

        UsuarioResponse usuarioId = buscarUsuarioSecurityAuthService.buscar();

        Usuario usuario = buscarUsuarioService.porId(usuarioId.getId());

        Usuario verificado = buscarUsuarioService.porId(id);

        if (usuario.getAmigos().indexOf(verificado) != -1){
            return 0;
        }

        if (verificado.getSolicitacoes().indexOf(usuario) != -1){
            return 2;
        }

        return 1;
    }
}
