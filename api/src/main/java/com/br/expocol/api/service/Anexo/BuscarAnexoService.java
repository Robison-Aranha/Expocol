package com.br.expocol.api.service.Anexo;

import com.br.expocol.api.domain.Usuario.Anexo;
import com.br.expocol.api.repository.Usuario.AnexoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service

public class BuscarAnexoService {

    @Autowired
    AnexoRepository anexoRepository;


    public Anexo porId(Long id) {
        return anexoRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Anexo não encontrado!!"));
    }

}
