package com.br.expocol.api.exception;



import org.apache.tomcat.util.http.fileupload.impl.SizeLimitExceededException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;



@RestControllerAdvice
public class UserControllerAdvice {

    @ResponseBody
    @ExceptionHandler(UserNotFound.class)
    public ResponseEntity<ExceptionMessageHandler> loginFailed(UserNotFound userNotFound){

        ExceptionMessageHandler error = new ExceptionMessageHandler(
                HttpStatus.NOT_FOUND.value(), "Usuario não encontrado!" , ""
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }


    @ResponseBody
    @ExceptionHandler(UserAlreadyExists.class)
    public ResponseEntity<ExceptionMessageHandler> userAlreadyExists(UserAlreadyExists userAlreadyExists){

        ExceptionMessageHandler error = new ExceptionMessageHandler(
                HttpStatus.CONFLICT.value(), "Usuario já existe no banco!", ""
        );

        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }


    @ResponseBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionMessageHandler> failedValidateCredentials(MethodArgumentNotValidException failedValidateCredentials) {

       List<FieldError> listaDeErros = failedValidateCredentials.getFieldErrors();

       StringBuilder expressaoFinal = new StringBuilder();

       expressaoFinal.append('[');

       int index = 1;

       for (FieldError erro : listaDeErros) {

           expressaoFinal.append('"' + erro.getDefaultMessage() + '"');

           if (listaDeErros.size() != index){

               expressaoFinal.append(",");

           }

           index++;
        }

        expressaoFinal.append(']');

        ExceptionMessageHandler error = new ExceptionMessageHandler(
                HttpStatus.CONFLICT.value(), "Credenciais invalidas!", expressaoFinal.toString()
        );


       return new ResponseEntity<>(error, HttpStatus.CONFLICT);

    }
    
    @ResponseBody
    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<ExceptionMessageHandler> invalidCredentials(InvalidCredentials invalidCredentials){

        ExceptionMessageHandler error = new ExceptionMessageHandler(
                HttpStatus.CONFLICT.value(), "Credenciais Inválidas!", ""
        );

        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ResponseBody
    @ExceptionHandler(SizeLimitExceededException.class)
    public ResponseEntity<ExceptionMessageHandler> sizeLimitUpload(SizeLimitExceededException overflowLimitation){

        ExceptionMessageHandler error = new ExceptionMessageHandler(
                HttpStatus.FORBIDDEN.value(), "O Arquivo execeu o limite de upload!", ""
        );

        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }
    
    @ResponseBody
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ExceptionMessageHandler> responseStatus(ResponseStatusException responseStatusException) {

        ExceptionMessageHandler error = new ExceptionMessageHandler(
                responseStatusException.getStatusCode().value(), responseStatusException.getReason(), ""
        );

        return new ResponseEntity<>(error, responseStatusException.getStatusCode());
    }

}
