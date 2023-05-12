package com.br.expocol.api.security.repository;


import com.br.expocol.api.domain.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByEmail(String email);

    @Query(value = "Select * from usuario where id != ?1 and id in (select id from usuario where nome like ?2% or email like ?2%)", nativeQuery = true)
    Page<Usuario> findUsuarios(Long id, String nome, Pageable pageable);


    @Query(value = "Select * from usuario where id in (select id_usuario2 from amigos where id_usuario1 = ?1) and (nome like ?2% or email like ?2%)", nativeQuery = true)
    Page<Usuario> findAmigos(Long id, String nome, Pageable pageable);
}
