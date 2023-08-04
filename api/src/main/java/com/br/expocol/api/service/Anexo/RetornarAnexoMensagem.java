package com.br.expocol.api.service.Anexo;

import com.br.expocol.api.controller.response.Anexo.AnexoContentResponse;
import com.br.expocol.api.domain.Usuario.Anexo;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class RetornarAnexoMensagem {

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    BuscarAnexoService buscarAnexoService;

    public AnexoContentResponse retornar(Long id) {

        usuarioAutenticadoService.get();

        Anexo anexo = buscarAnexoService.porId(id);

        AnexoContentResponse anexoContentResponse = new AnexoContentResponse();

        anexoContentResponse.setAnexo(anexo.getAnexo());
        anexoContentResponse.setAnexoName(anexo.getAnexoName());
        anexoContentResponse.setType(anexo.getAnexoContent());

        return anexoContentResponse;
    }
}
