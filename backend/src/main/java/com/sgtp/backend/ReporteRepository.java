package com.sgtp.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, String> {
    // Magia de Spring Data: cuenta automáticamente los reportes según su estado
    long countByEstado(String estado);
}