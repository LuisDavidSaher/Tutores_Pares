package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class EstudianteService {

    @Autowired
    private EstudianteRepository repository;

    // Busca un estudiante. Usamos Optional por si no existe.
    public Optional<Estudiante> buscarPorDocumento(String documento) {
        return repository.findById(documento);
    }

    // Guarda un estudiante nuevo
    public Estudiante guardar(Estudiante estudiante) {
        return repository.save(estudiante);
    }
}