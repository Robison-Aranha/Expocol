package com.br.expocol.api.security.jwt;

import com.br.expocol.api.domain.Usuario.Usuario;
import com.br.expocol.api.security.domain.Token;
import com.br.expocol.api.security.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Service

public class JwtService {

    @Autowired
    TokenRepository tokenRepository;

    @Value("${application.security.jwt.secret-key}")
    private String SECRET_KEY;

    public String generateToken(Usuario usuario) {
        return buildToken(new HashMap<>(), usuario);
    }

    public void saveToken(Usuario usuario, String tokenKey) {

        Token token = Token.builder()
                .token(tokenKey)
                .IsExpired(false)
                .usuarioToken(usuario)
                .build();

        tokenRepository.save(token);

    }

    public void deleteToken(Usuario usuario) {

        tokenRepository.deleteById(usuario.getToken().getId());

    }

    private String buildToken(
            Map<String, Object> extraClaims,
            Usuario usuario
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(usuario.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 120))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}