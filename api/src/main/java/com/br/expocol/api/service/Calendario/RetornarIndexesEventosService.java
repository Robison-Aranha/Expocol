package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.controller.response.Calendario.IndexesEventosResponse;
import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Dia;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.mapper.Calendario.RetornarIndexesEventosMapper;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service

public class RetornarIndexesEventosService {

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    BuscarAnoService buscarAnoService;

    public IndexesEventosResponse retornar(Integer anoRequest, String mesRequest, Integer diaRequest) {

        Usuario usuario = usuarioAutenticadoService.get();

        Ano ano = buscarAnoService.buscar(anoRequest, usuario);

        Mes mes = ano.getMeses().stream().filter(m -> m.getMes().name().equals(mesRequest.toUpperCase())).collect(Collectors.toList()).get(0);

        Dia dia  = mes.getDias().stream().filter(d -> d.getDiaValor().equals(diaRequest)).collect(Collectors.toList()).get(0);

        IndexesEventosResponse indexesResponse = new IndexesEventosResponse();

        indexesResponse.setIndexes(dia.getIndexes().stream().map(RetornarIndexesEventosMapper::toResponseIndex).collect(Collectors.toList()));
        indexesResponse.setEventos(dia.getEventos().stream().map(RetornarIndexesEventosMapper::toResponseEvento).collect(Collectors.toList()));

        return indexesResponse;
    }
}
