package com.br.expocol.api.controller;


import com.br.expocol.api.controller.request.EventoRequest;
import com.br.expocol.api.controller.response.Calendario.CalendarioMobileResponse;
import com.br.expocol.api.controller.response.Calendario.CalendarioResponse;
import com.br.expocol.api.controller.response.Calendario.EventoContentResponse;
import com.br.expocol.api.controller.response.Calendario.IndexesEventosResponse;
import com.br.expocol.api.service.Calendario.*;
import com.br.expocol.api.service.Calendario.AdicionarAnexoCalendarioService;
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
    RetornarMobileMesService retornarMobileMesService;

    @Autowired
    CreateCalendarService createCalendarService;

    @Autowired
    AdicionarAnexoCalendarioService adicionarAnexo;

    @Autowired
    VerificarParametroService verificarParametroService;

    @Autowired
    RetornarIndexesEventosService retornarIndexesService;

    @Autowired
    AdicionarEvento adicionarEventoDia;

    @Autowired
    RetornarEventoContentService retornarEventoContentService;

    @Autowired
    DeletarEventoService deletarEventoService;

    @GetMapping("/{ano}")
    public CalendarioResponse retornarAno(@RequestParam("mes") String mes, @PathVariable Integer ano) {

        verificarParametroService.verificar(mes);

        return retornarMesService.retornar(ano, mes);
    }

    @GetMapping("/mobile/{ano}")
    public CalendarioMobileResponse retornarAnoMobile(@RequestParam("mes") String mes, @PathVariable Integer ano) {

        verificarParametroService.verificar(mes);

        return retornarMobileMesService.retornar(ano, mes);
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
    public IndexesEventosResponse retornarIndexes(@PathVariable Integer ano, @RequestParam("mes") String mes, @RequestParam("dia") Integer dia) {

        verificarParametroService.verificar(mes);

        return retornarIndexesService.retornar(ano, mes, dia);
    }

    @PostMapping("/evento/{ano}")
    public void adicionarEvento(@PathVariable Integer ano, @RequestParam("mes") String mes, @RequestParam("dia") Integer dia, @RequestBody EventoRequest request) {

        verificarParametroService.verificar(mes);

        adicionarEventoDia.adicionar(ano, mes, dia, request);
    }

    @GetMapping("/evento/{id}")
    public EventoContentResponse retornarEvento(@PathVariable Long id) {
        return retornarEventoContentService.retornar(id);
    }

    @DeleteMapping("/evento/{id}")
    public void deletarEvento(@PathVariable Long id) {
        deletarEventoService.deletar(id);
    }

}
