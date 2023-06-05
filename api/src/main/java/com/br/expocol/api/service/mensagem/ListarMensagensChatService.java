package com.br.expocol.api.service.mensagem;


import com.br.expocol.api.domain.Chat;
import com.br.expocol.api.domain.Mensagem;
import com.br.expocol.api.domain.Usuario;
import com.br.expocol.api.mapper.MensagemMapper;
import com.br.expocol.api.repository.ChatRepository;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import com.br.expocol.api.websocket.domain.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ListarMensagensChatService {

    @Autowired
    ChatRepository chatRepository;

    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    BuscarChatService buscarChatService;

    public List<Message> listar(Long id) {

        UsuarioResponse usuarioId = buscarUsuarioSecurityAuthService.buscar();

        Usuario usuario = buscarUsuarioService.porId(usuarioId.getId());

        Usuario amigo = buscarUsuarioService.porId(id);

        Chat chatAmigo = buscarChatService.buscar(amigo, usuario);

        Chat chatUsuario = buscarChatService.buscar(usuario, amigo);

        List<Mensagem> mensagens = Stream.of(chatUsuario.getUsuarioMensagens(), chatAmigo.getUsuarioMensagens())
                .flatMap(x -> x.stream())
                .collect(Collectors.toList());

        List<Message> mensagensResponse = mensagens.stream().map(MensagemMapper::toResponse).collect(Collectors.toList());

        return mensagensResponse;
    }
}
