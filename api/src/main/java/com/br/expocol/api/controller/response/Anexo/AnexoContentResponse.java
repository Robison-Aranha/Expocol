package com.br.expocol.api.controller.response.Anexo;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AnexoContentResponse {

    private String anexo;

    private String type;

    private String anexoName;
}
