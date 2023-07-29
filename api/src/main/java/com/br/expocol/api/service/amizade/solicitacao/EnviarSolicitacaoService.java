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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EnviarSolicitacaoService {

    @Autowired
    UsuarioRepository usuarioRepository;
    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;
    @Autowired
    BuscarUsuarioService buscarUsuarioService;
    @Autowired
    MandarNotificaçãoService mandarNotificaçãoService;

    public void enviar(Long id) {

        Usuario usuario = usuarioAutenticadoService.get();

        Usuario solicitado = buscarUsuarioService.porId(id);

        if (solicitado.getUsuarioBloqueados().indexOf(usuario) == -1) {

            if (solicitado.getSolicitacoes().indexOf(usuario) != -1) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Voce ja enviou uma solicitacao para este usuario!");
            }

            if (solicitado.getAmigos().indexOf(usuario) != -1) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Voce ja é amigo deste usuario!");
            }

            solicitado.adicionarSolicitacao(usuario);

            usuarioRepository.save(solicitado);

            Notification notification = new Notification();
            notification.setTo(solicitado.getEmail());
            notification.setNotification(usuario.getNome() + " enviou uma solicitação de amizade!");

            mandarNotificaçãoService.mandar(notification, "/notification/solicitacoes");
        }
    }
}
