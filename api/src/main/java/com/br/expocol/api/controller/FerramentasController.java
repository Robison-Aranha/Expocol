package com.br.expocol.api.controller;


import com.br.expocol.api.controller.response.Ferramentas.AnaliseDeImagemResponse;
import com.br.expocol.api.controller.response.Ferramentas.ImagemProvaResponse;
import com.br.expocol.api.service.Ferramentas.AnalisarImagemProvaService;
import com.br.expocol.api.service.Ferramentas.AnalisarTextoImagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/ferramentas")
public class FerramentasController {

    @Autowired
    AnalisarTextoImagemService analisarTextoImagemService;

    @Autowired
    AnalisarImagemProvaService analisarImagemProvaService;

    @PostMapping("/analiseDeTexto/{idioma}")
    public AnaliseDeImagemResponse analisarImagem(@PathVariable String idioma,  @RequestParam("file") MultipartFile arquivo) throws IOException {

        return analisarTextoImagemService.analisar(idioma, arquivo);
    }

    @PostMapping("/analiseProvaImagem")
    public ImagemProvaResponse analisarImagemProva(@RequestParam("file") MultipartFile arquivo) throws IOException {
        return analisarImagemProvaService.analisar(arquivo);
    }

}
