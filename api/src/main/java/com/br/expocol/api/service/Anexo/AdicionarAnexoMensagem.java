package com.br.expocol.api.service.Anexo;

import com.br.expocol.api.controller.response.Anexo.AnexoIdResponse;
import com.br.expocol.api.domain.Usuario.Anexo;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.repository.Usuario.AnexoRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.Index.RetornarArquivoConvertidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@Service
public class AdicionarAnexoMensagem {

    private final Integer MAX_CARACTERS_INDEX_NAME = 25;

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    RetornarArquivoConvertidoService retornarArquivoConvertidoService;

    @Autowired
    AnexoRepository anexoRepository;

    public AnexoIdResponse adicionar(MultipartFile arquivo) throws IOException {

        usuarioAutenticadoService.get();

        if (arquivo.getOriginalFilename().length() > MAX_CARACTERS_INDEX_NAME) {
            throw new ResponseStatusException(HttpStatus.LENGTH_REQUIRED, "O arquivo deve exedeu o numero de caracteres no nome!!");
        }

        String arquivoConvertido = retornarArquivoConvertidoService.converter(arquivo);

        Anexo anexo = new Anexo();

        anexo.setAnexoContent(arquivo.getContentType());
        anexo.setAnexoName(arquivo.getOriginalFilename());
        anexo.setAnexo(arquivoConvertido);

        anexoRepository.save(anexo);

        AnexoIdResponse anexoIdResponse = new AnexoIdResponse();
        anexoIdResponse.setId(anexo.getId());
        anexoIdResponse.setAnexoName(anexo.getAnexoName());

        return anexoIdResponse;
    }
}
