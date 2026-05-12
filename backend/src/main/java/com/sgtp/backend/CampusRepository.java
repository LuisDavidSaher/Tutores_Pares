package com.sgtp.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampusRepository extends JpaRepository<Campus, Long> {
    // ¡Vacío! JpaRepository ya trae todos los comandos ocultos (guardar, borrar, buscarTodos)
}