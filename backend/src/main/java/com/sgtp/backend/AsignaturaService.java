package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AsignaturaService {
    @Autowired
    private AsignaturaRepository repository;

    public List<Asignatura> obtenerTodas() { return repository.findAll(); }
    public Asignatura guardar(Asignatura a) { return repository.save(a); }
    public void eliminar(Long id) { repository.deleteById(id); }
    public Asignatura actualizar(Long id, Asignatura act) {
        return repository.findById(id).map(a -> {
            a.setCodigo(act.getCodigo());
            a.setNombre(act.getNombre());
            a.setFacultad(act.getFacultad());
            a.setProgramas(act.getProgramas());
            return repository.save(a);
        }).orElseThrow(() -> new RuntimeException("Asignatura no encontrada"));
    }
}