package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class EstudianteService {

    @Autowired
    private EstudianteRepository repository;

    public Optional<Estudiante> buscarPorDocumento(String documento) {
        return repository.findById(documento);
    }

    public Estudiante guardar(Estudiante estudiante) {
        return repository.save(estudiante);
    }

    public Estudiante obtenerORegistrar(Estudiante estudiante) {
        // 1. Si ya existe por documento, lo devolvemos de inmediato
        Optional<Estudiante> existente = repository.findById(estudiante.getDocumento());
        if (existente.isPresent()) {
            return existente.get();
        }

        // 2. Si el documento es nuevo, verificamos que sus credenciales únicas no estén en uso
        if (estudiante.getCodigo() != null && repository.existsByCodigo(estudiante.getCodigo())) {
            throw new RuntimeException("Error: El código estudiantil " + estudiante.getCodigo() + " ya está registrado por otro estudiante.");
        }

        if (estudiante.getCorreo() != null && !estudiante.getCorreo().isEmpty() && repository.existsByCorreo(estudiante.getCorreo())) {
            throw new RuntimeException("Error: El correo " + estudiante.getCorreo() + " ya está en uso.");
        }

        // 3. Si todo está limpio, se registra en PostgreSQL
        return repository.save(estudiante);
    }
}