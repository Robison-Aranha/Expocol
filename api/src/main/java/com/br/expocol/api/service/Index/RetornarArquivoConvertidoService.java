package com.br.expocol.api.service.Index;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service

public class RetornarArquivoConvertidoService {


    public String converter(MultipartFile arquivo) throws IOException {

        String fileEncoded = Base64.getEncoder().encodeToString(arquivo.getBytes());

        StringBuilder sb = new StringBuilder();

        sb.append("data:" + arquivo.getContentType() + ";base64,");
        sb.append(fileEncoded);

        return sb.toString();
    }


}
