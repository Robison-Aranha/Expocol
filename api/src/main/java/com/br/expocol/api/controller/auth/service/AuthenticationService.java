package com.br.expocol.api.controller.auth.service;

import com.br.expocol.api.config.JwtService;
import com.br.expocol.api.controller.request.LoginRequest;
import com.br.expocol.api.controller.request.RegisterRequest;
import com.br.expocol.api.controller.response.AuthenticationResponse;
import com.br.expocol.api.entity.User;
import com.br.expocol.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthenticationResponse register(RegisterRequest request) {


        User user = new User();

        user.setUsername(request.getLogin());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder().token(jwtToken).build();

    }

    public AuthenticationResponse login(LoginRequest request) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getPassword()

                )

        );

        User user = userRepository.findByUsername(request.getLogin()).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String jwtToken = jwtService.generateToken(user);


        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}
