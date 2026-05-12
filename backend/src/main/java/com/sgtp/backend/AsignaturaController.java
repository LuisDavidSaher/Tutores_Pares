package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/asignaturas")
@CrossOrigin(origins = "http://localhost:5173")
public class AsignaturaController {
    @Autowired
    private AsignaturaService service;

    @GetMapping
    public List<Asignatura> listar() { return service.obtenerTodas(); }

    @PostMapping
    public Asignatura crear(@RequestBody Asignatura a) { return service.guardar(a); }

    @PutMapping("/{id}")
    public ResponseEntity<Asignatura> actualizar(@PathVariable Long id, @RequestBody Asignatura a) {
        try { return ResponseEntity.ok(service.actualizar(id, a)); }
        catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}