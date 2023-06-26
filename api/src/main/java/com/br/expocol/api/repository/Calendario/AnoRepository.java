package com.br.expocol.api.repository.Calendario;

import com.br.expocol.api.domain.Calendario.Ano;
import com.br.expocol.api.domain.Usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnoRepository extends JpaRepository<Ano, Long> {
    Optional<Ano> findByAnoValueAndUsuario(Integer anoValue, Usuario usuario);

}
