package com.br.expocol.api.repository;

import com.br.expocol.api.domain.PerfilUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PerfilUsuarioRepository extends JpaRepository<PerfilUsuario, Long> {

}
