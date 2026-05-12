package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/programas")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgramaController {
    @Autowired
    private ProgramaService service;

    @GetMapping
    public List<Programa> listar() { return service.obtenerTodos(); }

    @PostMapping
    public Programa crear(@RequestBody Programa p) { return service.guardar(p); }

    @PutMapping("/{id}")
    public ResponseEntity<Programa> actualizar(@PathVariable Long id, @RequestBody Programa p) {
        try { return ResponseEntity.ok(service.actualizar(id, p)); }
        catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}