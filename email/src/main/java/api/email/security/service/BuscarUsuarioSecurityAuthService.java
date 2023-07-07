package api.email.security.service;


import api.email.domain.Usuario;
import api.email.security.jwt.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class BuscarUsuarioSecurityAuthService {

    @Autowired
    private UsuarioAutenticadoService usuarioAutenticadoService;

    @Autowired
    JwtService jwtService;


    public void buscar() {
        Usuario usuarioAutenticado = usuarioAutenticadoService.get();
    }
}
