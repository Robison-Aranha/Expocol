package com.br.expocol.api.repository;

import com.br.expocol.api.domain.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
}
