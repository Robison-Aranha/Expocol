package com.br.expocol.api.service.Calendario;

import com.br.expocol.api.controller.response.Calendario.CalendarioResponse;
import com.br.expocol.api.controller.response.Calendario.DiaResponse;
import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.enumerator.DiasDaSemana;
import com.br.expocol.api.mapper.Calendario.RetornarDiasMapper;
import com.br.expocol.api.repository.Calendario.DiaRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.VerificarParametroService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service

public class RetornarMesService {

    @Autowired
    BuscarAnoService buscarAnoService;

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    VerificarParametroService verificarParametroService;

    @Autowired
    DiaRepository diaRepository;

    public CalendarioResponse retornar(Integer anoRequest, String mesRequest) {

        Usuario usuario = usuarioAutenticadoService.get();

        Ano ano = buscarAnoService.buscar(anoRequest, usuario);

        Mes mes = ano.getMeses().stream().filter(m -> m.getMes().toString().equals(mesRequest.toUpperCase())).collect(Collectors.toList()).get(0);

        CalendarioResponse calendarioResponse = new CalendarioResponse();

        Map dias = new HashMap<String, List<DiaResponse>>();

        Boolean verificador = false;

        Integer maiorFila = 0;

        for (DiasDaSemana dia : DiasDaSemana.values()) {

            List diasDaSemana = mes.getDias().stream().filter(d -> d.getDiaDaSemana() == dia).map(d -> {

                DiaResponse diaResponse = RetornarDiasMapper.toResponse(d);

                if (d.getIndexes().size() > 0) {
                    diaResponse.setIndex(true);
                } else {
                    diaResponse.setIndex(false);
                }

                if (d.getEventos().size() > 0) {
                    diaResponse.setEvent(true);
                } else {
                    diaResponse.setEvent(false);
                }

                return diaResponse;
            }
            ).collect(Collectors.toList());

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

            DiaResponse diaAtualP = atualSemana.get(0).getDiaValor() != null ? atualSemana.get(0) : atualSemana.get(1);
            DiaResponse diaAtualU = atualSemana.get(atualSemana.size() - 1).getDiaValor() != null ? atualSemana.get(atualSemana.size() - 1) : atualSemana.get(atualSemana.size() - 2);

            Boolean diaMaiorPDireita = false;
            Boolean diaMenorUEsquerda = false;

            for (int i = c; i < DiasDaSemana.values().length; i++) {

                DiasDaSemana diaVerificado = DiasDaSemana.values()[i];
                ArrayList<DiaResponse> semanaVerificada = (ArrayList<DiaResponse>) dias.get(diaVerificado.toString());

                DiaResponse diaDaSemana = semanaVerificada.get(0).getDiaValor() != null ? semanaVerificada.get(0) : semanaVerificada.get(1);

                if (diaDaSemana.getDiaValor() < diaAtualP.getDiaValor()) {
                    diaMaiorPDireita = true;
                    break;
                }
            }

            for (int i = c; i >= 0; i--) {

                DiasDaSemana diaVerificado = DiasDaSemana.values()[i];
                ArrayList<DiaResponse> semanaVerificada = (ArrayList<DiaResponse>) dias.get(diaVerificado.toString());

                DiaResponse diaDaSemana = semanaVerificada.get(semanaVerificada.size() - 1).getDiaValor() != null ? semanaVerificada.get(semanaVerificada.size() - 1) : semanaVerificada.get(semanaVerificada.size() - 2);

                if  (diaDaSemana.getDiaValor() > diaAtualU.getDiaValor()) {
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
