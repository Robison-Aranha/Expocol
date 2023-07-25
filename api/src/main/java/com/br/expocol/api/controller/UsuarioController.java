package com.br.expocol.api.controller;


import com.br.expocol.api.controller.request.UsuarioAtualizarRequest;
import com.br.expocol.api.controller.response.Usuario.UsuarioDetalharResponse;
import com.br.expocol.api.controller.response.Usuario.UsuarioListaComplResponse;
import com.br.expocol.api.controller.response.Usuario.UsuarioListaResponse;
import com.br.expocol.api.service.VerificarCredenciais;
import com.br.expocol.api.service.VerificarParametroService;
import com.br.expocol.api.service.perfilUsuario.DetalharPerfilUsuarioService;
import com.br.expocol.api.service.usuario.AtualizarImagemUsuario;
import com.br.expocol.api.service.usuario.AtualizarPerfilUsuario;
import com.br.expocol.api.service.usuario.ListarUsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {


    @Autowired
    ListarUsuarioService listarUsuarioService;

    @Autowired
    DetalharPerfilUsuarioService detalharPerfilUsuarioService;

    @Autowired
    VerificarParametroService verificarParametroService;

    @Autowired
    AtualizarPerfilUsuario atualizarPerfilUsuario;

    @Autowired
    AtualizarImagemUsuario atualizarImagemUsuario;

    @Autowired
    VerificarCredenciais verificarCredenciais;


    @GetMapping("/search")
    public Page<UsuarioListaComplResponse> listarUsuarios(@RequestParam("nome") String nome,
                                                          Pageable pageable){

        verificarParametroService.verificar(nome);

        return listarUsuarioService.listar(nome, pageable);
    }

    @PostMapping("/credenciais")
    public void atualizar(@RequestBody UsuarioAtualizarRequest request) throws IOException {
        
        verificarCredenciais.verificar(request);

        atualizarPerfilUsuario.atualizar(request);
    }

    @PostMapping("/imagemPerfil")
    public void atualizar(@RequestParam("file") MultipartFile arquivo) throws IOException {

        atualizarImagemUsuario.atualizar(arquivo);
    }



    @GetMapping()
    public UsuarioDetalharResponse detalhar(){
        return detalharPerfilUsuarioService.detalhar();
    }

}
