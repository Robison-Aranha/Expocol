package com.br.expocol.api.service.Index;


import com.br.expocol.api.controller.response.Index.IndexContentResponse;
import com.br.expocol.api.domain.Calendario.Index;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.IOException;

@Service

public class RetornarIndexContentService {


    @Autowired
    BuscarIndexService buscarIndexService;

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    public IndexContentResponse retornar(Long id) throws IOException {

        Index index = buscarIndexService.buscar(id);

        IndexContentResponse indexContentResponse = new IndexContentResponse();

        indexContentResponse.setIndex(index.getIndex());
        indexContentResponse.setType(index.getIndexContent());
        indexContentResponse.setIndexName(index.getIndexName());


        return indexContentResponse;
    }

}
