package com.br.expocol.api.service.mensagem;


import com.br.expocol.api.websocket.domain.Notification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class MandarNotificaçãoService {

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    public void mandar(Notification notification, String destination) {

        simpMessagingTemplate.convertAndSendToUser(notification.getTo(), destination, notification);
    }

}
