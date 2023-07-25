package com.br.expocol.api.controller;


import com.br.expocol.api.controller.response.Anexo.AnexoContentResponse;
import com.br.expocol.api.controller.response.Anexo.AnexoIdResponse;
import com.br.expocol.api.service.Anexo.AdicionarAnexoMensagem;
import com.br.expocol.api.service.Anexo.RetornarAnexoMensagem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/anexo")
public class AnexoController {


    @Autowired
    AdicionarAnexoMensagem adicionarAnexoMensagem;

    @Autowired
    RetornarAnexoMensagem retornarAnexoMensagem;

    @PostMapping
    public AnexoIdResponse adicionarAnexo(@RequestParam("file") MultipartFile arquivo) throws IOException {
        return adicionarAnexoMensagem.adicionar(arquivo);
    }

    @GetMapping("/{id}")
    public AnexoContentResponse retornarAnexo(@PathVariable Long id){
        return retornarAnexoMensagem.retornar(id);
    }

}
