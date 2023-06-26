package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.repository.Calendario.AnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BuscarAnoService {

    @Autowired
    AnoRepository anoRepository;


    public Ano buscar(Integer anoValue, Usuario usuario) {

        return anoRepository.findByAnoValueAndUsuario(anoValue, usuario).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ano não encontrado para este usuario!"));


    }

}
