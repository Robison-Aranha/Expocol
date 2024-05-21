package com.br.expocol.api.security.service;

import com.br.expocol.api.controller.request.LoginRequest;
import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.controller.request.TokenRequest;
import com.br.expocol.api.security.controller.response.TokenResponse;
import com.br.expocol.api.security.jwt.JwtService;
import com.br.expocol.api.security.repository.UsuarioRepository;
import com.br.expocol.api.service.VerificarParametroService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static com.br.expocol.api.security.mapper.UsuarioMapper.toResponse;

@Service
public class BuscarUsuarioSecurityAuthService {

	@Autowired
	UsuarioRepository usuarioRepository;
	

	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Autowired
	VerificarParametroService verificarParametroService;

	@Autowired
	JwtService jwtService;

	public TokenResponse buscar(LoginRequest request) {
		
		verificarParametroService.verificar(request.getGmail());
		verificarParametroService.verificar(request.getPassword());

		Usuario usuario = usuarioRepository.findByEmail(request.getGmail()).get();

		if (!passwordEncoder.matches(request.getPassword(), usuario.getSenha())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}

		jwtService.deleteToken(usuario);

		String newToken = jwtService.generateToken(usuario);

		jwtService.saveToken(usuario, newToken);

		return toResponse(newToken, usuario.getId());
	}

	public TokenResponse buscar(TokenRequest request) {

		verificarParametroService.verificar(request.getToken());
		
		String userEmail = jwtService.extractUsername(request.getToken());
		
		Usuario usuario = usuarioRepository.findByEmail(userEmail).get();
		
		jwtService.deleteToken(usuario);

		String newToken = jwtService.generateToken(usuario);

		jwtService.saveToken(usuario, newToken);
		
		return toResponse(newToken, usuario.getId());
	}

}
