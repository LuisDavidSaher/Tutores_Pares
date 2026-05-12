package com.sgtp.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TutoradoDetalleRepository extends JpaRepository<TutoradoDetalle, Long> {
    // Cuenta los tutorados según la palabra "ALTO" o "BAJO"
    long countByRiesgo(String riesgo);
}