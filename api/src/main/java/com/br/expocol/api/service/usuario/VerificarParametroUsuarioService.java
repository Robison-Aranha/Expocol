package com.br.expocol.api.service.usuario;


import com.br.expocol.api.exception.InvalidCredentials;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class VerificarParametroUsuarioService {

    public void verificar(String parametro) {

        String regex = ".*[@!#$%^&*()/\\\\]";

        if (regex.matches(parametro) || parametro == null || parametro.isEmpty()) {
            throw new InvalidCredentials();
        }

    }

}
