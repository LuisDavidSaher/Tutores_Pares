package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facultades")
@CrossOrigin(origins = "http://localhost:5173") // Puerto de React
public class FacultadController {

    @Autowired
    private FacultadService facultadService;

    @GetMapping
    public List<Facultad> listarFacultades() { return facultadService.obtenerTodas(); }

    @PostMapping
    public Facultad crearFacultad(@RequestBody Facultad facultad) { return facultadService.guardar(facultad); }

    @PutMapping("/{id}")
    public ResponseEntity<Facultad> actualizarFacultad(@PathVariable Long id, @RequestBody Facultad fac) {
        try {
            return ResponseEntity.ok(facultadService.actualizar(id, fac));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public void eliminarFacultad(@PathVariable Long id) { facultadService.eliminar(id); }
}