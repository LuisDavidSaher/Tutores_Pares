package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private ReporteRepository repository;

    public List<Reporte> obtenerTodos() {
        return repository.findAll();
    }

    public Reporte guardar(Reporte reporte) {
        // Al usar CascadeType.ALL, guardar el reporte guarda todo lo de adentro automáticamente
        return repository.save(reporte);
    }

    public Reporte actualizarEstado(String id, String nuevoEstado) {
        return repository.findById(id).map(reporte -> {
            reporte.setEstado(nuevoEstado);
            return repository.save(reporte);
        }).orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
    }
}