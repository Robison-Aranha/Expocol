package com.br.expocol.api.service.mensagem;


import com.br.expocol.api.domain.Chat;
import com.br.expocol.api.domain.Mensagem;
import com.br.expocol.api.domain.Usuario;
import com.br.expocol.api.mapper.MensagemMapper;
import com.br.expocol.api.repository.ChatRepository;
import com.br.expocol.api.repository.MensagemRepository;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import com.br.expocol.api.websocket.domain.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ListarMensagensChatService {

    private final Integer MAX_MESSAGES_PER_REQUEST = 15;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    @Autowired
    MensagemRepository mensagemRepository;

    public List<Message> listar(Long id, Integer index) {

        UsuarioResponse usuarioId = buscarUsuarioSecurityAuthService.buscar();

        if (index == null) {
            return mensagemRepository.findFirstsOrdenadedMessages(usuarioId.getId(), id, MAX_MESSAGES_PER_REQUEST).stream().map(MensagemMapper::toResponse)
                    .collect(Collectors.toList());
        }

        return mensagemRepository.findOrdenadedMessages(usuarioId.getId(), id, index, MAX_MESSAGES_PER_REQUEST).stream().map(MensagemMapper::toResponse)
                .collect(Collectors.toList());
    }
}
