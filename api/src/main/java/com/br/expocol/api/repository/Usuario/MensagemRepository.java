package com.br.expocol.api.repository.Usuario;


import com.br.expocol.api.domain.Usuario.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    @Query(value = "Select * from mensagem as m where m.id_chat in" +
            "(select c1.id from chat as c1 where c1.id_usuario = :usuarioId and c1.id_destinatario = :amigoId or " +
            "c1.id_usuario = :amigoId and c1.id_destinatario = :usuarioId ) and m.index < :index order by m.index desc limit :max_mensagens" , nativeQuery = true)
    List<Mensagem> findOrdenadedMessages(Long usuarioId, Long amigoId, Integer index, Integer max_mensagens);

    @Query(value = "Select * from mensagem as m where m.id_chat in " +
            "(select c1.id from chat as c1 where c1.id_usuario = :usuarioId and c1.id_destinatario = :amigoId or " +
            "c1.id_usuario = :amigoId and c1.id_destinatario = :usuarioId ) order by m.index desc limit :max_mensagens" , nativeQuery = true)
    List<Mensagem> findFirstsOrdenadedMessages(Long usuarioId, Long amigoId, Integer max_mensagens);

}
