package com.br.expocol.api.service;


import com.br.expocol.api.exception.InvalidCredentials;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service

public class VerificarParametroService {

    public void verificar(String parametro) {

        String regex = "^[a-zA-Z0-9]";

        if (regex.matches(parametro) || parametro == null || parametro.isEmpty()) {
            throw new InvalidCredentials();
        }
    }

}
