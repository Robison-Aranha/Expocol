package com.br.expocol.api.repository.Usuario;

import com.br.expocol.api.domain.Usuario.Anexo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnexoRepository extends JpaRepository<Anexo, Long> {
}
