package com.br.expocol.api.security.service;

import com.br.expocol.api.security.controller.request.UsuarioRequest;
import org.springframework.stereotype.Service;


@Service
public class VerificarCredenciais {


    public void verificar(UsuarioRequest request) {

        if (request.getNome().isBlank() || request.getNome().isEmpty()) {
            throw new RuntimeException("Existencia de credenciais invalidas!");
        }
        else if (request.getEmail().isBlank() || request.getEmail().isEmpty()){
            throw new RuntimeException("Existencia de credenciais invalidas!");
        }
        else if (request.getSenha().isBlank() || request.getSenha().isEmpty()) {
            throw new RuntimeException("Existencia de credenciais invalidas!");
        }

    }

}
