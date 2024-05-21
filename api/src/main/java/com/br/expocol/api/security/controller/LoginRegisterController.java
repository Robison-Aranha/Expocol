package com.br.expocol.api.security.controller;


import com.br.expocol.api.controller.request.LoginRequest;
import com.br.expocol.api.security.controller.request.TokenRequest;
import com.br.expocol.api.security.controller.request.UsuarioRequest;
import com.br.expocol.api.security.controller.response.TokenResponse;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.IncluirUsuarioService;
import com.br.expocol.api.service.VerificarCredenciais;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping()
public class LoginRegisterController {

    @Autowired
    private BuscarUsuarioSecurityAuthService buscarUsuarioService;

    @Autowired
    private IncluirUsuarioService incluirUsuarioService;

    @Autowired
    VerificarCredenciais verificarCredenciais;

    @Autowired
    UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest request) {
        return buscarUsuarioService.buscar(request);
    }

    @PostMapping("/register")
    public void incluir(@Valid @RequestBody UsuarioRequest request) {
        incluirUsuarioService.incluir(request);
    }

    @GetMapping("/refresh")
    public TokenResponse refresh(TokenRequest request) {
        return buscarUsuarioService.buscar(request);
    }
}
