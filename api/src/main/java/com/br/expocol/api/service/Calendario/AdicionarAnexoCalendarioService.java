package com.br.expocol.api.service.Calendario;


import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Dia;
import com.br.expocol.api.domain.Calendario.Index;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.repository.Calendario.IndexesRepository;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.Index.RetornarArquivoConvertidoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdicionarAnexoCalendarioService {

    private final Integer MAX_CARACTERS_INDEX_NAME = 25;

    @Autowired
    BuscarAnoService buscarAnoService;

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    RetornarArquivoConvertidoService retornarArquivoConvertidoService;

    @Autowired
    IndexesRepository indexesRepository;


    public void adicionar(Integer anoRequest, String mesRequest, Integer diaRequest, MultipartFile arquivo) throws IOException {

        if (arquivo.getOriginalFilename().length() > MAX_CARACTERS_INDEX_NAME) {
            throw new ResponseStatusException(HttpStatus.LENGTH_REQUIRED, "O arquivo deve exedeu o numero de caracteres no nome!!");
        }

        Usuario usuario = usuarioAutenticadoService.get();

        Ano ano = buscarAnoService.buscar(anoRequest, usuario);

        Mes mes = ano.getMeses().stream().filter(m -> m.getMes().toString().equals(mesRequest.toUpperCase())).collect(Collectors.toList()).get(0);

        Dia dia = mes.getDias().stream().filter(d -> d.getDiaValor().equals(diaRequest)).collect(Collectors.toList()).get(0);

        String arquivoConvertido = retornarArquivoConvertidoService.converter(arquivo);

        Index index = new Index();

        index.setDiaIndex(dia);
        index.setIndexName(arquivo.getOriginalFilename());
        index.setIndex(arquivoConvertido);
        index.setIndexContent(arquivo.getContentType());

        indexesRepository.save(index);
    }
}
