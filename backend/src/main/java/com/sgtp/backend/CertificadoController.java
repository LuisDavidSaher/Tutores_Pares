package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificados")
@CrossOrigin(origins = "*")
public class CertificadoController {

    @Autowired
    private CertificadoService certificadoService;

    @GetMapping("/{cedula}")
    public ResponseEntity<byte[]> descargarCertificado(@PathVariable String cedula) {

        // Llamamos al servicio para que forje el PDF
        byte[] pdfGenerado = certificadoService.generarCertificado(cedula);

        // Preparamos el paquete para que el navegador de React entienda que es un archivo descargable
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Certificado_Tutor_" + cedula + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfGenerado);
    }
}