package com.br.expocol.api.repository;

import com.br.expocol.api.domain.Chat;
import com.br.expocol.api.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    Optional<Chat> findByUsuarioAndDestinatario(Usuario usuario, Usuario amigo);
}
