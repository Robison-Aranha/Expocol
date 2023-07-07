package com.br.expocol.api.controller.response.Index;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class IndexContentResponse {

    private String index;

    private String type;

    private String indexName;

}
