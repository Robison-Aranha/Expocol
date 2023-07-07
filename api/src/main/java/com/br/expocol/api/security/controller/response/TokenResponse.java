package com.br.expocol.api.security.controller.response;


import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TokenResponse {

    private String token;

}
