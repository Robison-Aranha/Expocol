package com.br.expocol.api.service.amizade.solicitacao;

import com.br.expocol.api.controller.response.Usuario.UsuarioListaResponse;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.mapper.Usuario.ListarUsuarioMapper;
import com.br.expocol.api.security.controller.response.UsuarioResponse;
import com.br.expocol.api.security.service.BuscarUsuarioSecurityAuthService;
import com.br.expocol.api.security.service.UsuarioAutenticadoService;
import com.br.expocol.api.service.usuario.BuscarUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListarSolicitacoesService {

    @Autowired
    UsuarioAutenticadoService usuarioAutenticadoService;

    public Page<UsuarioListaResponse> listar(Pageable pageable) {

        Usuario usuario = usuarioAutenticadoService.get();

        List<UsuarioListaResponse> lista = usuario.getSolicitacoes().stream().map(ListarUsuarioMapper::toResponse).collect(Collectors.toList());

        return new PageImpl<>(lista);
    }
}