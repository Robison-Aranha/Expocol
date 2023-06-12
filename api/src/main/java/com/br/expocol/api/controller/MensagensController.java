package com.br.expocol.api.controller;


import com.br.expocol.api.service.mensagem.ListarMensagensChatService;
import com.br.expocol.api.websocket.domain.Message;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/mensagens")
public class MensagensController {

    @Autowired
    ListarMensagensChatService listarMensagensChatService;

    @GetMapping("/{id}")
    public List<Message> listarMensagens(@PathVariable Long id, @Param("index") Integer index) {

        return listarMensagensChatService.listar(id, index);
    }

}
