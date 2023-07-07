package com.br.expocol.api.security.controller;


import com.br.expocol.api.security.controller.request.UsuarioRequest;
import com.br.expocol.api.security.controller.response.TokenResponse;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.IncluirUsuarioService;
import com.br.expocol.api.security.service.VerificarCredenciais;
import com.br.expocol.api.service.Calendario.CreateCalendarService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


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
    private VerificarCredenciais verificarCredenciais;

    @PostMapping("/login")
    public TokenResponse login() {
        return buscarUsuarioService.buscar();
    }

    @PostMapping("/register")
    public void incluir(@Valid @RequestBody UsuarioRequest request, HttpServletResponse response) {

        verificarCredenciais.verificar(request);

        incluirUsuarioService.incluir(request, response);
    }

    @GetMapping("/refresh")
    public TokenResponse refresh() {
        return buscarUsuarioService.buscar();
    }
}
