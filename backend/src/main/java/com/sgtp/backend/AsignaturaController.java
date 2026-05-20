package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/asignaturas")
@CrossOrigin(origins = "*") // Asterisco para evitar bloqueos
public class AsignaturaController {

    @Autowired
    private AsignaturaService service;

    // MODIFICADO PARA LA TAREA 3.1: Filtro inteligente
    @GetMapping
    public List<Asignatura> listar(@RequestParam(required = false) String programa) {
        List<Asignatura> todas = service.obtenerTodas();

        if (programa != null && !programa.isEmpty() && !programa.equals("MULTI-PROGRAMA (ADMIN)")) {
            return todas.stream()
                    .filter(a -> a.getProgramas() != null && a.getProgramas().contains(programa))
                    .collect(Collectors.toList());
        }

        return todas;
    }

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