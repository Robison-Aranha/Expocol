package com.br.expocol.api.service.Ferramentas;


import com.br.expocol.api.controller.response.Ferramentas.AnaliseDeImagemResponse;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class AnalisarTextoImagemService {


    public AnaliseDeImagemResponse analisar(String idioma, MultipartFile arquivo) throws IOException {


        BufferedImage image = ImageIO.read(arquivo.getInputStream());

        String result = new String();
        try {
            Tesseract tesseract = new Tesseract();
            tesseract.setLanguage(idioma);
            tesseract.setDatapath("src/main/resources/Tesseract-OCR/tessdata");
            result = tesseract.doOCR(image);
        } catch (TesseractException e) {
            e.printStackTrace();
        }

        AnaliseDeImagemResponse analiseDeImagemResponse = new AnaliseDeImagemResponse();
        analiseDeImagemResponse.setTextoEncontrado(result);

        return analiseDeImagemResponse;
    }


}
