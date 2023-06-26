package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.domain.Calendario.Index;
import com.br.expocol.api.repository.Calendario.IndexesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BuscarIndexService {

    @Autowired
    IndexesRepository indexesRepository;

    public Index buscar(Long id) {

        return indexesRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum index para esse id!"));

    }

}
