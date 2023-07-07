package api.email.security.repository;


import api.email.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNome(String nome);

    Optional<Usuario> findByEmail(String username);

    Optional<Usuario> findById(Long id);
}
