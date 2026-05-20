package com.sgtp.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, String> {
    // Estos métodos permiten verificar existencia sin traer todo el objeto, lo que es más rápido
    boolean existsByCodigo(String codigo);
    boolean existsByCorreo(String correo);
}