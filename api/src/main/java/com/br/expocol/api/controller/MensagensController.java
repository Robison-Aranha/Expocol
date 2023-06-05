package com.br.expocol.api.controller;


import com.br.expocol.api.service.mensagem.ListarMensagensChatService;
import com.br.expocol.api.websocket.domain.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/mensagens")
public class MensagensController {

    @Autowired
    ListarMensagensChatService listarMensagensChatService;

    @GetMapping("/{id}")
    public List<Message> listarMensagens(@PathVariable Long id) {
        return listarMensagensChatService.listar(id);
    }

}
