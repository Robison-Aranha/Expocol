package com.br.expocol.api.service.amizade;

import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VerificarAmizadeSolicitacaoService {

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    public Integer verificar(Long id) {

        Usuario usuario = usuarioAutenticadoService.get();

        Usuario verificado = buscarUsuarioService.porId(id);

        if (usuario.getUsuarioBloqueados().indexOf(verificado) != -1) {
            return 4;
        }

        if (verificado.getUsuarioBloqueados().indexOf(usuario) != -1) {
            return 5;
        }

        if (usuario.getSolicitacoes().indexOf(verificado) != -1) {
            return 3;
        }

        if (usuario.getAmigos().indexOf(verificado) != -1){
            return 0;
        }

        if (verificado.getSolicitacoes().indexOf(usuario) != -1){
            return 2;
        }

        return 1;
    }
}
