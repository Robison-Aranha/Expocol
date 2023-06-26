package com.br.expocol.api.service.Index;


import com.br.expocol.api.repository.Calendario.IndexesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeletarIndexService {

    @Autowired
    IndexesRepository indexesRepository;

    public void deletar(Long id) {
        indexesRepository.deleteById(id);
    }

}
