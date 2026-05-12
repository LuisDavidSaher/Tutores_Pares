package com.sgtp.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {
    // Comando para traer los registros ordenados por fecha descendente (los más nuevos primero)
    List<Auditoria> findAllByOrderByFechaHoraDesc();
}