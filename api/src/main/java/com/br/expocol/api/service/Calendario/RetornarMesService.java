package com.br.expocol.api.service.Calendario;

import com.br.expocol.api.controller.response.Calendario.CalendarioResponse;
import com.br.expocol.api.controller.response.Calendario.DiaResponse;
import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.enumerator.DiasDaSemana;
import com.br.expocol.api.mapper.Calendario.RetornarDiasMapper;
import com.br.expocol.api.repository.Calendario.DiaRepository;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class RetornarMesService {

    @Autowired
    BuscarAnoService buscarAnoService;

    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    DiaRepository diaRepository;

    public CalendarioResponse retornar(Integer anoRequest, String mesRequest) {

        UsuarioResponse usuarioId = buscarUsuarioSecurityAuthService.buscar();

        Usuario usuario = buscarUsuarioService.porId(usuarioId.getId());

        Ano ano = buscarAnoService.buscar(anoRequest, usuario);

        Mes mes = ano.getMeses().stream().filter(m -> m.getMes().toString().equals(mesRequest.toUpperCase())).collect(Collectors.toList()).get(0);

        CalendarioResponse calendarioResponse = new CalendarioResponse();

        Map dias = new HashMap<String, List<DiaResponse>>();

        Boolean verificador = false;

        Integer maiorFila = 0;

        for (DiasDaSemana dia : DiasDaSemana.values()) {

            List diasDaSemana = mes.getDias().stream().filter(d -> d.getDiaDaSemana() == dia).map(RetornarDiasMapper::toResponse).collect(Collectors.toList());

            dias.put(dia.toString(), diasDaSemana);

            if (diasDaSemana.size() > maiorFila) {
                maiorFila = diasDaSemana.size();
            }

        }

        for (int c = 0; c < DiasDaSemana.values().length; c++) {

            DiasDaSemana dia = DiasDaSemana.values()[c];

            ArrayList<DiaResponse> atualSemana = new ArrayList<>();

            DiaResponse diaVazio = new DiaResponse();

            atualSemana = (ArrayList<DiaResponse>) dias.get(dia.toString());

            DiaResponse diaAtualP = atualSemana.get(0).getDiaValue() != null ? atualSemana.get(0) : atualSemana.get(1);
            DiaResponse diaAtualU = atualSemana.get(atualSemana.size() - 1).getDiaValue() != null ? atualSemana.get(atualSemana.size() - 1) : atualSemana.get(atualSemana.size() - 2);

            Boolean diaMaiorPDireita = false;
            Boolean diaMenorUEsquerda = false;

            for (int i = c; i < DiasDaSemana.values().length; i++) {

                DiasDaSemana diaVerificado = DiasDaSemana.values()[i];
                ArrayList<DiaResponse> semanaVerificada = (ArrayList<DiaResponse>) dias.get(diaVerificado.toString());

                DiaResponse diaDaSemana = semanaVerificada.get(0).getDiaValue() != null ? semanaVerificada.get(0) : semanaVerificada.get(1);

                if (diaDaSemana.getDiaValue() < diaAtualP.getDiaValue()) {
                    diaMaiorPDireita = true;
                    break;
                }
            }

            for (int i = c; i >= 0; i--) {

                DiasDaSemana diaVerificado = DiasDaSemana.values()[i];
                ArrayList<DiaResponse> semanaVerificada = (ArrayList<DiaResponse>) dias.get(diaVerificado.toString());

                DiaResponse diaDaSemana = semanaVerificada.get(semanaVerificada.size() - 1).getDiaValue() != null ? semanaVerificada.get(semanaVerificada.size() - 1) : semanaVerificada.get(semanaVerificada.size() - 2);

                if  (diaDaSemana.getDiaValue() > diaAtualU.getDiaValue()) {
                    diaMenorUEsquerda = true;
                    break;
                }
            }

            if (diaMaiorPDireita && diaMenorUEsquerda) {

                atualSemana.add(diaVazio);

                atualSemana.add(0, diaVazio);

            } else if (diaMaiorPDireita) {

                atualSemana.add(0, diaVazio);

            } else if (diaMenorUEsquerda) {

                atualSemana.add(diaVazio);

            }

        }

        calendarioResponse.setDays(dias);

        return calendarioResponse;
    }

}
