package com.br.expocol.api.controller.response.Calendario;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CalendarioResponse {

    Map<String, ArrayList<DiaResponse>> days;

}
