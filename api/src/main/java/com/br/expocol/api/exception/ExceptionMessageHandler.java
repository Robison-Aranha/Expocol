package com.br.expocol.api.exception;

import lombok.Data;

import java.util.Date;


@Data
public class ExceptionMessageHandler {

    private Date timeStamp;

    private Integer status;

    private String message;

    private String fields;

    public ExceptionMessageHandler(Integer status, String message, String fields) {
        this.timeStamp = new Date();
        this.status = status;
        this.message = message;
        this.fields = fields;
    }

}
