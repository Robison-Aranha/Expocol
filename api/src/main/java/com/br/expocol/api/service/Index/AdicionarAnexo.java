package com.br.expocol.api.service.Index;


import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Dia;
import com.br.expocol.api.domain.Calendario.Index;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.repository.Calendario.IndexesRepository;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.service.Calendario.BuscarAnoService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Base64;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdicionarAnexo {

    private final Integer MAX_CARACTERS_INDEX_NAME = 25;

    @Autowired
    BuscarAnoService buscarAnoService;

    @Autowired
    BuscarUsuarioSecurityAuthService buscarUsuarioSecurityAuthService;

    @Autowired
    BuscarUsuarioService buscarUsuarioService;

    @Autowired
    IndexesRepository indexesRepository;


    public void adicionar(Integer anoRequest, String mesRequest, Integer diaRequest, MultipartFile arquivo) throws IOException {

        if (arquivo.getOriginalFilename().length() > MAX_CARACTERS_INDEX_NAME) {
            throw new ResponseStatusException(HttpStatus.LENGTH_REQUIRED, "O arquivo deve exedeu o numero de caracteres no nome!!");
        }

        UsuarioResponse usuarioId = buscarUsuarioSecurityAuthService.buscar();

        Usuario usuario = buscarUsuarioService.porId(usuarioId.getId());

        Ano ano = buscarAnoService.buscar(anoRequest, usuario);

        Mes mes = ano.getMeses().stream().filter(m -> m.getMes().toString().equals(mesRequest.toUpperCase())).collect(Collectors.toList()).get(0);

        Dia dia = mes.getDias().stream().filter(d -> d.getDiaValor().equals(diaRequest)).collect(Collectors.toList()).get(0);

        String fileEncoded = Base64.getEncoder().encodeToString(arquivo.getBytes());

        StringBuilder sb = new StringBuilder();

        sb.append("data:" + arquivo.getContentType() + ";base64,");
        sb.append(fileEncoded);

        Index index = new Index();

        index.setDia(dia);
        index.setIndexName(arquivo.getOriginalFilename());
        index.setIndex(sb.toString());
        index.setIndexContent(arquivo.getContentType());

        indexesRepository.save(index);
    }
}
