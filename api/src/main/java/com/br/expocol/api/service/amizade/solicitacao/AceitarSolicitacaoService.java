package com.br.expocol.api.service.amizade.solicitacao;

import com.br.expocol.api.domain.Usuario.Chat;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.repository.Usuario.ChatRepository;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.mensagem.MandarNotificaçãoService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import com.br.expocol.api.websocket.domain.Notification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AceitarSolicitacaoService {


    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;
    @Autowired
    BuscarUsuarioService buscarUsuarioService;
    @Autowired
    UsuarioRepository usuarioRepository;
    @Autowired
    ChatRepository chatRepository;
    @Autowired
    MandarNotificaçãoService mandarNotificaçãoService;

    public void aceitar(Long id) {

        Usuario usuario = usuarioAutenticadoService.get();

        Usuario amigo = buscarUsuarioService.porId(id);

        if (usuario.getSolicitacoes().indexOf(amigo) == -1){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse usuario não lhe enviou nenhuma solicitacao!");
        }

        usuario.retirarSolicitacao(amigo);

        usuario.adicionarAmigo(amigo);

        Chat chatUsuario = new Chat();
        Chat chatAmigo = new Chat();

        chatUsuario.setUsuarioChat(usuario);
        chatUsuario.setDestinatario(amigo);
        chatAmigo.setUsuarioChat(amigo);
        chatAmigo.setDestinatario(usuario);

        chatRepository.save(chatUsuario);
        chatRepository.save(chatAmigo);

        usuarioRepository.save(usuario);

        Notification notificationUsuario = new Notification();
        notificationUsuario.setTo(usuario.getEmail());
        notificationUsuario.setFrom(amigo.getEmail());
        notificationUsuario.setNotification(amigo.getNome() + " foi aceito como amigo!");

        Notification notificationAmigo = new Notification();
        notificationAmigo.setTo(amigo.getEmail());
        notificationAmigo.setFrom(usuario.getEmail());
        notificationAmigo.setNotification(usuario.getNome() + " aceitou sua solicitação!");

        mandarNotificaçãoService.mandar(notificationUsuario, "/notification/friends");
        mandarNotificaçãoService.mandar(notificationAmigo, "/notification/friends");

    }
}