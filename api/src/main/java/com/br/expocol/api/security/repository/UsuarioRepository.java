package com.br.expocol.api.security.repository;


import com.br.expocol.api.domain.Usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query(value = "Select * from usuario where id != ?1 and (nome like ?2% or email like ?2%)", nativeQuery = true)
    Page<Usuario> findUsuarios(Long id, String nome, Pageable pageable);

    Optional<Usuario> findByNome(String nome);

    Optional<Usuario> findByEmail(String username);
}
