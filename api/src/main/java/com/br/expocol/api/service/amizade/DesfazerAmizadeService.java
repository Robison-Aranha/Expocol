package com.br.expocol.api.service.amizade;

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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DesfazerAmizadeService {


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

    public void desfazer(Long id) {

        Usuario usuario = usuarioAutenticadoService.get();

        Usuario amigo = buscarUsuarioService.porId(id);

        List<Chat> listaChat = usuario.desfazerAmizade(amigo);

        listaChat.forEach(chat -> chatRepository.deleteById(chat.getId()));

        usuarioRepository.save(usuario);

        Notification notificationUsuario = new Notification();
        notificationUsuario.setTo(usuario.getEmail());
        notificationUsuario.setFrom(amigo.getEmail());


        Notification notificationAmigo = new Notification();
        notificationAmigo.setTo(amigo.getEmail());
        notificationAmigo.setFrom(usuario.getEmail());

        mandarNotificaçãoService.mandar(notificationUsuario, "/notification/friends");
        mandarNotificaçãoService.mandar(notificationAmigo, "/notification/friends");

    }
}