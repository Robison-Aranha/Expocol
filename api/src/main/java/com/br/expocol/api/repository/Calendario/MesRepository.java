package com.br.expocol.api.repository.Calendario;

import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Calendario.Mes;
import com.br.expocol.api.enumerator.MesesDoAno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MesRepository extends JpaRepository<Mes, Long> {
    Optional<Mes> findByAnoAndMes(Ano ano, MesesDoAno mesesDoAno);
}
