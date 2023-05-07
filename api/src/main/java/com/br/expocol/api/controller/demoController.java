package com.br.expocol.api.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class demoController {

    @GetMapping
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Sexo 2.0");
    }

}
