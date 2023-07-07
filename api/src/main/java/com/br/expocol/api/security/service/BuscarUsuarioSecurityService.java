package com.br.expocol.api.security.service;


import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.domain.UsuarioSecurity;
import com.br.expocol.api.security.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class BuscarUsuarioSecurityService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email).get();
        return new UsuarioSecurity(usuario);
    }
}
