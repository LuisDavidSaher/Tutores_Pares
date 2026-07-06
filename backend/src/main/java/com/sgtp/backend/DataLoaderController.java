package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/dataloader")
@CrossOrigin(origins = "*")
public class DataLoaderController {

    @Autowired
    private DataLoaderService dataLoaderService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadExcelFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El archivo está vacío.");
        }

        try {
            dataLoaderService.procesarExcel(file);
            return ResponseEntity.ok("Carga masiva procesada exitosamente.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error procesando el archivo: " + e.getMessage());
        }
    }
}