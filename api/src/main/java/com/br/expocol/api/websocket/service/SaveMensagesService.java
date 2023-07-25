package com.br.expocol.api.websocket.service;



import com.br.expocol.api.domain.Usuario.Anexo;
import com.br.expocol.api.domain.Usuario.Chat;
import com.br.expocol.api.domain.Usuario.Mensagem;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.repository.Usuario.ChatRepository;
import com.br.expocol.api.repository.Usuario.MensagemRepository;
import com.br.expocol.api.service.Anexo.BuscarAnexoService;
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

    @Autowired
    BuscarAnexoService buscarAnexoService;

    public void salvar(Message mensagem) {

        Usuario usuario = buscarUsuarioService.porEmail(mensagem.getFrom());

        Usuario amigo = buscarUsuarioService.porEmail(mensagem.getTo());

        Anexo anexo;

        try {
            anexo = buscarAnexoService.porId(mensagem.getAnexoId());

        } catch (Exception e) {

            anexo = null;
        }

        Chat chat = buscarChatService.buscar(usuario, amigo);

        Mensagem novaMensagem = new Mensagem();

        novaMensagem.setMensagem(mensagem.getMessage());
        novaMensagem.setUsuario(usuario);
        novaMensagem.setDestinatario(amigo);
        novaMensagem.setChat(chat);
        novaMensagem.setIndex(mensagem.getIndex());
        novaMensagem.setAnexo(anexo);

        mensagemRepository.save(novaMensagem);

        chat.getUsuarioMensagens().put(mensagem.getIndex(), novaMensagem);

        chatRepository.save(chat);
    }

}
