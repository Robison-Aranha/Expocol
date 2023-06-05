package com.br.expocol.api.mapper;

import com.br.expocol.api.domain.Mensagem;
import com.br.expocol.api.websocket.domain.Message;

public class MensagemMapper {


    public static Message toResponse(Mensagem entity) {

        return Message.builder()
                .to(entity.getDestinatario().getNome())
                .message(entity.getMensagem())
                .build();
    }

}
