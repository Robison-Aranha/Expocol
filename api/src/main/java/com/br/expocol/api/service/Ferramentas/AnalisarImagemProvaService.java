package com.br.expocol.api.service.Ferramentas;



import com.br.expocol.api.controller.response.Ferramentas.ImagemProvaResponse;
import nu.pattern.OpenCV;
import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.awt.image.WritableRaster;
import java.io.*;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class AnalisarImagemProvaService {


    public ImagemProvaResponse analisar(MultipartFile arquivo) throws IOException {

        OpenCV.loadLocally();

        BufferedImage imagemAnalisar = ImageIO.read(arquivo.getInputStream());

        String formatData = arquivo.getContentType().substring(6);

        Mat img = BufferedImageToMat(imagemAnalisar, formatData);

        Mat proceded = processImage(img);

        markOuterContour(proceded, img);

        String result = drawImage(img, formatData);

        return ImagemProvaResponse.builder().imagem(result).build();

    }

    public static Mat BufferedImageToMat(BufferedImage image, String type) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(image, type, byteArrayOutputStream);
        byteArrayOutputStream.flush();
        return Imgcodecs.imdecode(new MatOfByte(byteArrayOutputStream.toByteArray()), Imgcodecs.CV_LOAD_IMAGE_UNCHANGED);
    }


    public static Mat processImage(final Mat mat) {

        final Mat processed = new Mat(mat.height(), mat.width(), mat.type());

        Imgproc.GaussianBlur(mat, processed, new Size(7, 7), 1);


        Imgproc.cvtColor(processed, processed, Imgproc.COLOR_RGB2GRAY);


        Imgproc.Canny(processed, processed, 200, 25);


        return processed;
    }

    public static void markOuterContour(final Mat processedImage,
                                        final Mat originalImage) {
        // Find contours of an image
        final List<MatOfPoint> allContours = new ArrayList<>();
        Imgproc.findContours(
                processedImage,
                allContours,
                new Mat(processedImage.size(), processedImage.type()),
                Imgproc.RETR_EXTERNAL,
                Imgproc.CHAIN_APPROX_NONE
        );

        // Filter out noise and display contour area value
        final List<MatOfPoint> filteredContours = allContours.stream()
                .filter(contour -> {

                    Double value = Imgproc.contourArea(contour);
                    Rect rect = Imgproc.boundingRect(contour);

                    boolean isNotNoise = value > 1000;

                    if (isNotNoise) {
                        Imgproc.putText (
                                originalImage,
                                "Witdh: " + (int) rect.width,
                                new Point(rect.x, rect.y + rect.height / 2),
                                2,
                                0.5,
                                new Scalar(124, 252, 0),
                                1
                        );

                        Imgproc.putText (
                                originalImage,
                                "Heigth: " + rect.height,
                                new Point(rect.x, rect.y + rect.height / 2 + 15),
                                2,
                                0.5,
                                new Scalar(124, 252, 0),
                                1
                        );
                    }

                    return isNotNoise;
                }).collect(Collectors.toList());

        // Mark contours
        Imgproc.drawContours(
                originalImage,
                filteredContours,
                -1, // Negative value indicates that we want to draw all of contours
                new Scalar(124, 252, 0), // Green color
                1
        );
    }

    public static String drawImage(final Mat mat, String type) throws IOException {

        BufferedImage image = convertMatToBufferedImage(mat);

        ByteArrayOutputStream os = new ByteArrayOutputStream();

        String result = new String();

        try
        {
            ImageIO.write(image, type, os);
            result = Base64.getEncoder().encodeToString(os.toByteArray());
        }
        catch (final IOException ioe)
        {
            throw new UncheckedIOException(ioe);
        }

        StringBuilder sb = new StringBuilder();

        sb.append("data:image/png;base64,");
        sb.append(result);

        return sb.toString();
    }

    private static BufferedImage convertMatToBufferedImage(final Mat mat) {

        BufferedImage bufferedImage = new BufferedImage(
                mat.width(),
                mat.height(),
                mat.channels() == 1 ? BufferedImage.TYPE_BYTE_GRAY : BufferedImage.TYPE_3BYTE_BGR
        );


        WritableRaster raster = bufferedImage.getRaster();
        DataBufferByte dataBuffer = (DataBufferByte) raster.getDataBuffer();
        mat.get(0, 0, dataBuffer.getData());

        return bufferedImage;
    }
}


