package com.br.expocol.api.service.amizade;


import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.mensagem.MandarNotificaçãoService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import com.br.expocol.api.websocket.domain.Notification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class DesbloquearUsuarioService {

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    MandarNotificaçãoService mandarNotificaçãoService;

    public void desbloquearUsuario(Long id) {

        Usuario usuario = usuarioAutenticadoService.get();

        Usuario usuarioASerBloqueado = buscarUsuarioService.porId(id);

        usuario.getUsuarioBloqueados().remove(usuarioASerBloqueado);

        usuarioRepository.save(usuario);

        Notification notificationUsuario = new Notification();
        notificationUsuario.setTo(usuario.getEmail());
        notificationUsuario.setFrom(usuarioASerBloqueado.getEmail());


        Notification notificationAmigo = new Notification();
        notificationAmigo.setTo(usuarioASerBloqueado.getEmail());
        notificationAmigo.setFrom(usuario.getEmail());

        mandarNotificaçãoService.mandar(notificationUsuario, "/notification/friends");
        mandarNotificaçãoService.mandar(notificationAmigo, "/notification/friends");
    }



}
