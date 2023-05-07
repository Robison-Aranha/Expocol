package com.br.expocol.api.controller.auth;


import com.br.expocol.api.controller.auth.service.AuthenticationService;
import com.br.expocol.api.controller.request.LoginRequest;
import com.br.expocol.api.controller.request.RegisterRequest;
import com.br.expocol.api.controller.response.AuthenticationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody @Validated RegisterRequest request) {

        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody @Validated LoginRequest request) {


        return ResponseEntity.ok(authenticationService.login(request));
    }

}
