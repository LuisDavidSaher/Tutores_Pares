package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "http://localhost:5173")
public class EstudianteController {

    @Autowired
    private EstudianteService service;

    // GET: React usa esto cuando da clic en "Buscar en BD"
    @GetMapping("/{documento}")
    public ResponseEntity<Estudiante> obtenerEstudiante(@PathVariable String documento) {
        return service.buscarPorDocumento(documento)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()); // Devuelve un 404 si no lo encuentra
    }

    // POST: React usa esto para guardar un estudiante la primera vez
    @PostMapping
    public Estudiante registrarEstudiante(@RequestBody Estudiante estudiante) {
        return service.guardar(estudiante);
    }
}