package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.domain.Calendario.Evento;
import com.br.expocol.api.repository.Calendario.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BuscarEventoService {

    @Autowired
    EventoRepository eventoRepository;


    public Evento buscar(Long id) {

        return eventoRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum evento para este id!"));

    }

}
