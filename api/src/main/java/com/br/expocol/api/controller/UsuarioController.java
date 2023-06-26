package com.br.expocol.api.controller;


import com.br.expocol.api.controller.response.Usuario.UsuarioDetalharResponse;
import com.br.expocol.api.controller.response.Usuario.UsuarioListaResponse;
import com.br.expocol.api.service.perfilUsuario.DetalharPerfilUsuarioService;
import com.br.expocol.api.service.usuario.ListarUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {


    @Autowired
    ListarUsuarioService listarUsuarioService;

    @Autowired
    DetalharPerfilUsuarioService detalharPerfilUsuarioService;

    @GetMapping("/search")
    public Page<UsuarioListaResponse> listarUsuarios(@RequestParam("nome") String nome,
                                                     Pageable pageable){



        return listarUsuarioService.listar(nome, pageable);
    }

    @GetMapping()
    public UsuarioDetalharResponse detalhar(){
        return detalharPerfilUsuarioService.detalhar();
    }

}
