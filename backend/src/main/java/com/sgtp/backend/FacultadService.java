package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FacultadService {

    @Autowired
    private FacultadRepository facultadRepository;

    public List<Facultad> obtenerTodas() { return facultadRepository.findAll(); }

    public Facultad guardar(Facultad facultad) { return facultadRepository.save(facultad); }

    public void eliminar(Long id) { facultadRepository.deleteById(id); }

    public Facultad actualizar(Long id, Facultad facultadActualizada) {
        return facultadRepository.findById(id).map(fac -> {
            fac.setNombre(facultadActualizada.getNombre());

            fac.setCampus(facultadActualizada.getCampus());
            return facultadRepository.save(fac);
        }).orElseThrow(() -> new RuntimeException("Facultad no encontrada"));
    }
}