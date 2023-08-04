package com.br.expocol.api.service.Calendario;

import com.br.expocol.api.enumerator.DiasDaSemana;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class DiaDaSemanaService {

    public DiasDaSemana retornar(Integer dia, Integer anoRequest, Integer mesRequest) {

        Integer CalculoPrimeiroDiaDaSemana = (dia + (2 * mesRequest) + (3 * (mesRequest + 1) / 5) + anoRequest + (anoRequest / 4) - (anoRequest / 100) + (anoRequest / 400) + 2) % 7;

        switch (CalculoPrimeiroDiaDaSemana) {
            case 0:
                return DiasDaSemana.SABADO;
            case 1:
                return DiasDaSemana.DOMINGO;
            case 2:
                return DiasDaSemana.SEGUNDA_FEIRA;
            case 3:
                return DiasDaSemana.TERCA_FEIRA;
            case 4:
                return DiasDaSemana.QUARTA_FEIRA;
            case 5:
                return DiasDaSemana.QUINTA_FEIRA;
            default:
                return DiasDaSemana.SEXTA_FEIRA;

        }
    }


}
