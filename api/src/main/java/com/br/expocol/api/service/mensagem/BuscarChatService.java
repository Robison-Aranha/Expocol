package com.br.expocol.api.service.mensagem;


import com.br.expocol.api.domain.Usuario.Chat;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.repository.Usuario.ChatRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class BuscarChatService {

    @Autowired
    ChatRepository chatRepository;

    public Chat buscar(Usuario usuario, Usuario amigo) {

        return chatRepository.findByUsuarioChatAndDestinatario(usuario, amigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma conversa para este usuario!"));

    }

}
