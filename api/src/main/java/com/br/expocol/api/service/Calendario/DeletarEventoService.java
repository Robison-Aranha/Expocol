package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.repository.Calendario.EventoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class DeletarEventoService {

    @Autowired
    EventoRepository eventoRepository;
    public void deletar(Long id) {

        eventoRepository.deleteById(id);

    }
}
