package com.br.expocol.api.service.amizade.solicitacao;

import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.mensagem.MandarNotificaçãoService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import com.br.expocol.api.websocket.domain.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IgnorarSolicitacaoService {


    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    MandarNotificaçãoService mandarNotificaçãoService;

    public void ignorar(Long id) {

        Usuario usuario = usuarioAutenticadoService.get();

        Usuario solicitador = buscarUsuarioService.porId(id);

        usuario.retirarSolicitacao(solicitador);

        usuarioRepository.save(usuario);

        Notification notification = new Notification();
        notification.setTo(solicitador.getEmail());
        notification.setFrom(usuario.getEmail());
        notification.setNotification(usuario.getNome() + " negou sua solicitação!");

        mandarNotificaçãoService.mandar(notification, "/notification/friends");
    }
}