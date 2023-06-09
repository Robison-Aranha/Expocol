package com.br.expocol.api.websocket.domain;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Message {

    private Long from;

    private String to;

    private Integer index;

    private String message;

}
