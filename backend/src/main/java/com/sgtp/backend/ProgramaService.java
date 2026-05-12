package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProgramaService {
    @Autowired
    private ProgramaRepository repository;

    public List<Programa> obtenerTodos() { return repository.findAll(); }
    public Programa guardar(Programa programa) { return repository.save(programa); }
    public void eliminar(Long id) { repository.deleteById(id); }

    public Programa actualizar(Long id, Programa act) {
        return repository.findById(id).map(p -> {
            p.setNombre(act.getNombre());
            p.setFacultad(act.getFacultad());
            p.setCampus(act.getCampus());

            // AQUÍ SE AGREGA LA ACTUALIZACIÓN DE LA MODALIDAD
            p.setModalidad(act.getModalidad());

            return repository.save(p);
        }).orElseThrow(() -> new RuntimeException("Programa no encontrado"));
    }
}