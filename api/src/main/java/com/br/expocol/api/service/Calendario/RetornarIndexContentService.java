package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.controller.response.Calendario.IndexContentResponse;
import com.br.expocol.api.domain.Calendario.Index;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.util.Base64;

@Service
public class RetornarIndexContentService {


    @Autowired
    BuscarIndexService buscarIndexService;

    public IndexContentResponse retornar(Long id) throws IOException {

        Index index = buscarIndexService.buscar(id);

        IndexContentResponse indexContentResponse = new IndexContentResponse();

        indexContentResponse.setIndex(index.getIndex());
        indexContentResponse.setType(index.getIndexContent());
        indexContentResponse.setIndexName(index.getIndexName());


        return indexContentResponse;
    }

}
