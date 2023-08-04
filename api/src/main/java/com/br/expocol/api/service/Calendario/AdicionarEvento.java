package com.br.expocol.api.service.Calendario;

import com.br.expocol.api.controller.request.EventoRequest;
import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Dia;
import com.br.expocol.api.domain.Calendario.Evento;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.repository.Calendario.EventoRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;


@Service
@Transactional
public class AdicionarEvento {

    @Autowired
    BuscarAnoService buscarAnoService;

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    EventoRepository eventoRepository;

    public void adicionar(Integer anoRequest, String mesRequest, Integer diaRequest, EventoRequest eventoRequest) {

        Usuario usuario = usuarioAutenticadoService.get();

        Ano ano = buscarAnoService.buscar(anoRequest, usuario);

        Mes mes = ano.getMeses().stream().filter(m -> m.getMes().toString().equals(mesRequest.toUpperCase())).collect(Collectors.toList()).get(0);

        Dia dia = mes.getDias().stream().filter(d -> d.getDiaValor().equals(diaRequest)).collect(Collectors.toList()).get(0);

        Evento evento = new Evento();

        evento.setDiaEvento(dia);
        evento.setDescricao(eventoRequest.getDescricao());
        evento.setTempo(eventoRequest.getTempo());
        evento.setTitulo(eventoRequest.getTitulo());
        evento.setDataNotificacao(eventoRequest.getDataNotificacao());
        evento.setSchedulerName(eventoRequest.getSchedulerName());
        evento.setSchedulerGroup(eventoRequest.getSchedulerGroup());

        eventoRepository.save(evento);
    }


}
