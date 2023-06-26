package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.controller.response.Calendario.IndexResponse;
import com.br.expocol.api.controller.response.Calendario.IndexesResponse;
import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Dia;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.mapper.Calendario.RetornarIndexesMapper;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class RetornarIndexesService {

    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    BuscarAnoService buscarAnoService;

    public IndexesResponse retornar(Integer anoRequest, String mesRequest, Integer diaRequest) {

        UsuarioResponse usuarioId = buscarUsuarioSecurityAuthService.buscar();

        Usuario usuario = buscarUsuarioService.porId(usuarioId.getId());

        Ano ano = buscarAnoService.buscar(anoRequest, usuario);

        Mes mes = ano.getMeses().stream().filter(m -> m.getMes().name().equals(mesRequest.toUpperCase())).collect(Collectors.toList()).get(0);

        Dia dia  = mes.getDias().stream().filter(d -> d.getDiaValor().equals(diaRequest)).collect(Collectors.toList()).get(0);

        IndexesResponse indexesResponse = new IndexesResponse();

        indexesResponse.setIndexes(dia.getIndexes().stream().map(RetornarIndexesMapper::toResponse).collect(Collectors.toList()));

        return indexesResponse;
    }
}
