package com.br.expocol.api.controller;


import com.br.expocol.api.controller.response.Calendario.CalendarioResponse;
import com.br.expocol.api.controller.response.Calendario.IndexesResponse;
import com.br.expocol.api.service.Calendario.*;
import com.br.expocol.api.service.Index.AdicionarAnexo;
import com.br.expocol.api.service.VerificarParametroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/calendario")
public class CalendarioController {

    @Autowired
    RetornarMesService retornarMesService;

    @Autowired
    CreateCalendarService createCalendarService;

    @Autowired
    AdicionarAnexo adicionarAnexo;

    @Autowired
    VerificarParametroService verificarParametroService;

    @Autowired
    RetornarIndexesService retornarIndexesService;

    @GetMapping("/{ano}")
    public CalendarioResponse retornarAno(@RequestParam("mes") String mes, @PathVariable Integer ano) {

        verificarParametroService.verificar(mes);

        return retornarMesService.retornar(ano, mes);
    }

    @PostMapping("/{ano}")
    public void createCalendar(@PathVariable Integer ano) {
        createCalendarService.create(ano);
    }

    @PutMapping("/index/{ano}")
    public void adicionarAnexo(@PathVariable Integer ano, @RequestParam("mes") String mes, @RequestParam("dia") Integer dia, @RequestParam("file") MultipartFile arquivo) throws IOException {

        verificarParametroService.verificar(mes);

        adicionarAnexo.adicionar(ano, mes, dia, arquivo);
    }

    @GetMapping("/index/{ano}")
    public IndexesResponse retornarIndexes(@PathVariable Integer ano, @RequestParam("mes") String mes, @RequestParam("dia") Integer dia) {

        return retornarIndexesService.retornar(ano, mes, dia);
    }

}
