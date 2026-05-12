package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/campus")
@CrossOrigin(origins = "http://localhost:5173") // OJO: Ponga aquí el puerto donde corre su React (Suele ser 5173 o 3000)
public class CampusController {

    @Autowired
    private CampusService campusService;

    // GET: React usa esto para llenar la tabla
    @GetMapping
    public List<Campus> listarCampus() {
        return campusService.obtenerTodos();
    }

    // POST: React usa esto cuando hacemos clic en "Guardar Campus"
    @PostMapping
    public Campus crearCampus(@RequestBody Campus campus) {
        return campusService.guardar(campus);
    }
    // DELETE: React usa esto para borrar un campus
    @DeleteMapping("/{id}")
    public void eliminarCampus(@PathVariable Long id) {
        campusService.eliminar(id);
    }

    // PUT: React usa esto para actualizar un campus existente
    @PutMapping("/{id}")
    public ResponseEntity<Campus> actualizarCampus(@PathVariable Long id, @RequestBody Campus campusActualizado) {
        try {
            Campus campus = campusService.actualizar(id, campusActualizado);
            return ResponseEntity.ok(campus);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}