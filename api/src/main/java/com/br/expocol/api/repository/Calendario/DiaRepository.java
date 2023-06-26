package com.br.expocol.api.repository.Calendario;

import com.br.expocol.api.domain.Calendario.Dia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DiaRepository extends JpaRepository<Dia, Long> {

}
