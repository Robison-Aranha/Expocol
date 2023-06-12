package com.br.expocol.api.websocket.service;


import com.br.expocol.api.domain.Chat;
import com.br.expocol.api.domain.Mensagem;
import com.br.expocol.api.domain.Usuario;
import com.br.expocol.api.repository.ChatRepository;
import com.br.expocol.api.repository.MensagemRepository;
import com.br.expocol.api.service.mensagem.BuscarChatService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import com.br.expocol.api.websocket.domain.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SaveMensagesService {

    @Autowired
    ChatRepository chatRepository;

    @Autowired
    MensagemRepository mensagemRepository;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    BuscarChatService buscarChatService;

    public void salvar(Message mensagem) {

        Usuario usuario = buscarUsuarioService.porId(mensagem.getFrom());

        Usuario amigo = buscarUsuarioService.porNome(mensagem.getTo());

        Chat chat = buscarChatService.buscar(usuario, amigo);

        Mensagem novaMensagem = new Mensagem();

        novaMensagem.setMensagem(mensagem.getMessage());
        novaMensagem.setUsuario(usuario);
        novaMensagem.setDestinatario(amigo);
        novaMensagem.setChat(chat);
        novaMensagem.setIndex(mensagem.getIndex());

        mensagemRepository.save(novaMensagem);

        chat.getUsuarioMensagens().put(mensagem.getIndex(), novaMensagem);

        chatRepository.save(chat);
    }

}
