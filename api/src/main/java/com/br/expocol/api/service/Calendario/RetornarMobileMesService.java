package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.controller.response.Calendario.CalendarioMobileResponse;
import com.br.expocol.api.controller.response.Calendario.DiaResponse;
import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Dia;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.mapper.Calendario.RetornarDiasMapper;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.stream.Collectors;


@Service

public class RetornarMobileMesService {


    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    BuscarAnoService buscarAnoService;


    public CalendarioMobileResponse retornar(Integer anoRequest, String mesRequest) {

        Usuario usuario = usuarioAutenticadoService.get();

        Ano ano = buscarAnoService.buscar(anoRequest, usuario);

        Mes mes = ano.getMeses().stream().filter(m -> m.getMes().toString().equals(mesRequest.toUpperCase())).collect(Collectors.toList()).get(0);

        ArrayList<DiaResponse> dias = new ArrayList<DiaResponse>();

        for (Dia dia : mes.getDias()) {

            DiaResponse diaResponse = RetornarDiasMapper.toResponse(dia);

            if (dia.getIndexes().size() > 0) {
                diaResponse.setIndex(true);
            } else {
                diaResponse.setIndex(false);
            }

            if (dia.getEventos().size() > 0) {
                diaResponse.setEvent(true);
            } else {
                diaResponse.setEvent(false);
            }

            dias.add(diaResponse);
        }

        return CalendarioMobileResponse.builder().days(dias).build();
    }


}
