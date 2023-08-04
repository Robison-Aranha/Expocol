package com.br.expocol.api.service.Calendario;

import com.br.expocol.api.controller.response.Calendario.EventoContentResponse;
import com.br.expocol.api.domain.Calendario.Evento;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class RetornarEventoContentService {

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    BuscarEventoService buscarEventoService;

    public EventoContentResponse retornar(Long id) {

        usuarioAutenticadoService.get();

        Evento evento = buscarEventoService.buscar(id);

        EventoContentResponse eventoContentResponse = new EventoContentResponse();

        eventoContentResponse.setTitulo(evento.getTitulo());
        eventoContentResponse.setTempo(evento.getTempo());
        eventoContentResponse.setDescricao(evento.getDescricao());
        eventoContentResponse.setDataNotificacao(evento.getDataNotificacao());

        return eventoContentResponse;
    }
}
