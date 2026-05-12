package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auditorias")
@CrossOrigin(origins = "http://localhost:5173")
public class AuditoriaController {

    @Autowired
    private AuditoriaService service;

    @GetMapping
    public List<Auditoria> listarAuditorias() {
        return service.obtenerTodas();
    }

    @PostMapping
    public Auditoria crearRegistro(@RequestBody Auditoria auditoria) {
        return service.registrar(auditoria);
    }
}