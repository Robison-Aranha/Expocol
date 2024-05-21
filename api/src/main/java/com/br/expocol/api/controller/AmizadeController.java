package com.br.expocol.api.controller;


import com.br.expocol.api.controller.response.Usuario.UsuarioListaComplResponse;
import com.br.expocol.api.controller.response.Usuario.UsuarioListaResponse;
import com.br.expocol.api.service.amizade.*;
import com.br.expocol.api.service.amizade.solicitacao.AceitarSolicitacaoService;
import com.br.expocol.api.service.amizade.solicitacao.EnviarSolicitacaoService;
import com.br.expocol.api.service.amizade.solicitacao.IgnorarSolicitacaoService;
import com.br.expocol.api.service.amizade.solicitacao.ListarSolicitacoesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/amigos")
public class AmizadeController {
    @Autowired
    ListarAmigosService listarAmigosService;

    @Autowired
    DesfazerAmizadeService desfazerAmizadeService;

    @Autowired
    ListarSolicitacoesService listarSolicitacoesService;

    @Autowired
    EnviarSolicitacaoService enviarSolicitacaoService;

    @Autowired
    AceitarSolicitacaoService aceitarSolicitacaoService;

    @Autowired
    IgnorarSolicitacaoService ignorarSolicitacaoService;
    
    @Autowired
    BloquearUsuariosService bloquearUsuariosService;

    @Autowired
    DesbloquearUsuarioService desbloquearUsuarioService;


    @Autowired
    VerificarAmizadeSolicitacaoService verificarAmizadeSolicitacaoService;

    @GetMapping("/solicitacoes")
    public Page<UsuarioListaResponse> listarSolicitacoes(Pageable pageable){
        return listarSolicitacoesService.listar(pageable);
    }

    @GetMapping("/verificar/{id}")
    public Integer verificarAmigosSolicitacoes(@PathVariable Long id){
        return verificarAmizadeSolicitacaoService.verificar(id);
    }

    @PutMapping("/enviar/{id}")
    public void enviarSolicitacao(@PathVariable Long id) {
        enviarSolicitacaoService.enviar(id);
    }

    @PutMapping("/aceitar/{id}")
    public void aceitar(@PathVariable Long id){
        aceitarSolicitacaoService.aceitar(id);
    }

    @PutMapping("/ignorar/{id}")
    public void ignorar(@PathVariable Long id){
        ignorarSolicitacaoService.ignorar(id);
    }

    @GetMapping()
    public Page<UsuarioListaComplResponse> listarAmigos(){
        return listarAmigosService.listar();
    }

    @PutMapping("/desfazer/{id}")
    public void desfazerAmizade(@PathVariable Long id){
        desfazerAmizadeService.desfazer(id);
    }
    
    @PutMapping("/bloquear/{id}")
    public void bloquearUsuario(@PathVariable Long id) { bloquearUsuariosService.bloquearUsuario(id); }

    @PutMapping("/desbloquear/{id}")
    public void desbloquearUsuario(@PathVariable Long id) { desbloquearUsuarioService.desbloquearUsuario(id); }

}
