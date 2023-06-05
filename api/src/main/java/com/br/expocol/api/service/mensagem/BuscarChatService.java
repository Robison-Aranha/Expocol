package com.br.expocol.api.service.mensagem;


import com.br.expocol.api.domain.Chat;
import com.br.expocol.api.domain.Usuario;
import com.br.expocol.api.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BuscarChatService {

    @Autowired
    ChatRepository chatRepository;

    public Chat buscar(Usuario usuario, Usuario amigo) {

        return chatRepository.findByUsuarioAndDestinatario(usuario, amigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma conversa para este usuario!"));

    }

}
