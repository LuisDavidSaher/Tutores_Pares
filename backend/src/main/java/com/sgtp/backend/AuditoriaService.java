package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditoriaService {

    @Autowired
    private AuditoriaRepository repository;

    // Solo necesitamos registrar y leer. (Las auditorías NO se editan ni se borran por seguridad)
    public Auditoria registrar(Auditoria auditoria) {
        return repository.save(auditoria);
    }

    public List<Auditoria> obtenerTodas() {
        return repository.findAllByOrderByFechaHoraDesc();
    }
}