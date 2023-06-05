package com.br.expocol.api.websocket;


import com.br.expocol.api.websocket.domain.Message;
import com.br.expocol.api.websocket.domain.Notification;
import com.br.expocol.api.websocket.service.SaveMensagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SocketController {

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    SaveMensagesService saveMensagesService;


    @MessageMapping("/private")
    public void sendMessageToUser(@Payload Message message) {

        simpMessagingTemplate.convertAndSendToUser(message.getTo(), "/chat", message);

        saveMensagesService.salvar(message);

    }

}
