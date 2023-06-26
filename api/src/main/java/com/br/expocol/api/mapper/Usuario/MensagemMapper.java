package com.br.expocol.api.mapper.Usuario;


import com.br.expocol.api.domain.Usuario.Mensagem;
import com.br.expocol.api.websocket.domain.Message;

public class MensagemMapper {


    public static Message toResponse(Mensagem entity) {

        return Message.builder()
                .to(entity.getDestinatario().getNome())
                .index(entity.getIndex())
                .message(entity.getMensagem())
                .build();
    }

}
