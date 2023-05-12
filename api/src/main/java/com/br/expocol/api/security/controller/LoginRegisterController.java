package com.br.expocol.api.security.controller;


import com.br.expocol.api.security.controller.request.UsuarioRequest;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.IncluirUsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping()
public class LoginRegisterController {

    @Autowired
    private BuscarUsuarioSecurityAuthService buscarUsuarioService;

    @Autowired
    private IncluirUsuarioService incluirUsuarioService;

    @PostMapping("/login")
    public UsuarioResponse login() {
        return buscarUsuarioService.buscar();
    }

    @PostMapping("/register")
    public UsuarioResponse incluir(@Valid @RequestBody UsuarioRequest request) {
        return incluirUsuarioService.incluir(request);
    }
}
