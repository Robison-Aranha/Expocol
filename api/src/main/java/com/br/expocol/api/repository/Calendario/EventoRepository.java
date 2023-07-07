package com.br.expocol.api.repository.Calendario;

import com.br.expocol.api.domain.Calendario.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<Evento, Long> {
}
