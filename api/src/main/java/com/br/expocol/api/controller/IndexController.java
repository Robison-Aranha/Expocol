package com.br.expocol.api.controller;


import com.br.expocol.api.controller.response.Index.IndexContentResponse;
import com.br.expocol.api.service.Index.RetornarIndexContentService;
import com.br.expocol.api.service.Index.DeletarIndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/index")
public class IndexController {

    @Autowired
    RetornarIndexContentService retornarIndexContentService;

    @Autowired
    DeletarIndexService deletarIndexService;

    @GetMapping("/{id}")
    public IndexContentResponse retornarIndexContent(@PathVariable Long id) throws IOException {
        return retornarIndexContentService.retornar(id);
    }

    @DeleteMapping("/{id}")
    public void deletarIndex(@PathVariable Long id) {
        deletarIndexService.deletar(id);
    }

}
