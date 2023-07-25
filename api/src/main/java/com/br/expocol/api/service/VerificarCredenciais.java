package com.br.expocol.api.service;

import com.br.expocol.api.controller.request.UsuarioAtualizarRequest;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.regex.Pattern;


@Service
public class VerificarCredenciais {

    private final String  REGEX_EMAIL = "^[A-Za-z0-9+_.-]+@(.+)$";

    Pattern patternEmail = Pattern.compile(REGEX_EMAIL);

    private final String  REGEX_NOME = "^[a-zA-Z0-9]{6,12}$";

    Pattern patternNome = Pattern.compile(REGEX_NOME);


    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    public void verificar(UsuarioAtualizarRequest request) {

        Usuario usuario = usuarioAutenticadoService.get();

        if (request.getNome() != null && !request.getNome().isEmpty()) {

            if (patternNome.matcher(request.getNome()).matches()) {

                if (usuario.getNome().equals(request.getNome())) {
                    throw new ResponseStatusException(HttpStatus.FOUND, "Nome de usuario não pode ser igual ao atual!!");
                }
            }
            else {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Nome Invalido!");
            }
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {

            if (patternEmail.matcher(request.getEmail()).matches()) {

                if (usuario.getEmail().equals(request.getEmail())) {
                    throw new ResponseStatusException(HttpStatus.FOUND, "Email de usuario não pode ser igual ao atual!!");
                } else {

                    Boolean findEmail = usuarioRepository.findByEmail(request.getEmail()).isPresent();

                    if (findEmail) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email ja existe!!");
                    }
                }
            }
            else {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Email Invalido!");
            }

        }

    }


}
