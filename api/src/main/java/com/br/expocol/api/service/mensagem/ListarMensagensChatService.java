package com.br.expocol.api.service.mensagem;


import com.br.expocol.api.mapper.Usuario.MensagemMapper;
import com.br.expocol.api.repository.Usuario.MensagemRepository;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import com.br.expocol.api.websocket.domain.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
