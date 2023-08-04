package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Dia;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.enumerator.DiasDaSemana;
import com.br.expocol.api.enumerator.MesesDoAno;
import com.br.expocol.api.repository.Calendario.AnoRepository;
import com.br.expocol.api.repository.Calendario.DiaRepository;
import com.br.expocol.api.repository.Calendario.MesRepository;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.concurrent.ExecutionException;


@Service
public class CreateCalendarService {

    @Autowired
    DiaDaSemanaService diaDaSemanaService;

    @Autowired
    AnoRepository anoRepository;

    @Autowired
    MesRepository mesRepository;

    @Autowired
    DiaRepository diaRepository;

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    BuscarAnoService buscarAnoService;

    public void create(Integer anoRequest) {

        Usuario usuario = usuarioAutenticadoService.get();

        try {
            buscarAnoService.buscar(anoRequest, usuario);

            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ano ja existe para esse usuario!");
        } catch (Exception e) {

            Boolean anoBissexto = (anoRequest / 4) % 10 > 0 ? false : true;

            Ano ano = new Ano();
            ano.setUsuario(usuario);
            ano.setAnoValue(anoRequest);

            anoRepository.save(ano);

            for (int c = 0; c < 12; c++) {
                Integer mesCount;

                if (c != 1) {
                    mesCount = (c + 1) % 2 == 0 ? 30 : 31;
                } else {
                    mesCount = anoBissexto ? 29 : 28;
                }

                Mes mes = new Mes();
                mes.setAno(ano);
                mes.setMes(MesesDoAno.values()[c]);

                mesRepository.save(mes);

                for (int i = 1; i <= mesCount; i++) {

                    Dia dia = new Dia();
                    dia.setMes(mes);
                    dia.setDiaValor(i);

                    DiasDaSemana diasDaSemana = diaDaSemanaService.retornar(i, c == 0 || c == 1 ? ano.getAnoValue() - 1 : ano.getAnoValue(), c == 0 ? 13 : c == 1 ? 14 : c + 1);

                    dia.setDiaDaSemana(diasDaSemana);

                    diaRepository.save(dia);
                }
            }
        }

    }


}
