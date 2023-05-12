package com.br.expocol.api.exception;

import lombok.Data;

import java.util.Date;


@Data
public class ExceptionMessageHandler {

    private Date timeStamp;

    private Integer status;

    private String message;

    public ExceptionMessageHandler(Integer status, String message) {
        this.timeStamp = new Date();
        this.status = status;
        this.message = message;
    }

}
