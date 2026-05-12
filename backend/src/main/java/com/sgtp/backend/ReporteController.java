package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:5173")
public class ReporteController {

    @Autowired
    private ReporteService service;

    // GET: React pide todos los reportes para llenar la tabla inicial
    @GetMapping
    public List<Reporte> listarReportes() {
        return service.obtenerTodos();
    }

    // POST: React envía el JSON gigante y nosotros lo guardamos entero
    @PostMapping
    public Reporte crearReporte(@RequestBody Reporte reporte) {
        return service.guardar(reporte);
    }

    // PUT: React avisa que el reporte se cerró y pasa a estado "Final"
    @PutMapping("/{id}/estado")
    public ResponseEntity<Reporte> cambiarEstado(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String nuevoEstado = body.get("estado");
            return ResponseEntity.ok(service.actualizarEstado(id, nuevoEstado));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}