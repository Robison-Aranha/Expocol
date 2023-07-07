package api.email.repository;


import api.email.domain.PerfilUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PerfilUsuarioRepository extends JpaRepository<PerfilUsuario, Long> {

}
