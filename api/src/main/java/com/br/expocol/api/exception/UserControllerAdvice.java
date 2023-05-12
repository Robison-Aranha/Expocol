package com.br.expocol.api.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class UserControllerAdvice {

    @ResponseBody
    @ExceptionHandler(LoginFailed.class)
    public ResponseEntity<ExceptionMessageHandler> loginFailed(LoginFailed userNotFound){

        ExceptionMessageHandler error = new ExceptionMessageHandler(
                HttpStatus.NOT_FOUND.value(), "Usuario não encontrado"
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }


    @ResponseBody
    @ExceptionHandler(UserAlreadyExists.class)
    public ResponseEntity<ExceptionMessageHandler> userAlreadyExists(UserAlreadyExists userAlreadyExists){

        ExceptionMessageHandler error = new ExceptionMessageHandler(
                HttpStatus.CONFLICT.value(), "Usuario já existe no banco"
        );

        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }


}
