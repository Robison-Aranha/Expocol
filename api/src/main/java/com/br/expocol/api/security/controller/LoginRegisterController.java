package com.br.expocol.api.security.controller;


import com.br.expocol.api.security.controller.request.UsuarioRequest;
import com.br.expocol.api.security.controller.response.TokenResponse;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.IncluirUsuarioService;
import com.br.expocol.api.service.Calendario.CreateCalendarService;
import com.br.expocol.api.service.VerificarCredenciais;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping()
public class LoginRegisterController {

    @Autowired
    private BuscarUsuarioSecurityAuthService buscarUsuarioService;

    @Autowired
    private IncluirUsuarioService incluirUsuarioService;

    @Autowired
    private CreateCalendarService createCalendarService;

    @Autowired
    VerificarCredenciais verificarCredenciais;

    @Autowired
    UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public TokenResponse login() {
        return buscarUsuarioService.buscar();
    }

    @PostMapping("/register")
    public void incluir(@Valid @RequestBody UsuarioRequest request, HttpServletResponse response) {

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email ja esta sendo usado!!");
        }

        incluirUsuarioService.incluir(request, response);
    }

    @GetMapping("/refresh")
    public TokenResponse refresh() {
        return buscarUsuarioService.buscar();
    }
}
