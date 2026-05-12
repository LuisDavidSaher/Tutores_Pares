package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CampusService {

    @Autowired
    private CampusRepository campusRepository;

    // Comando para buscar todos los campus
    public List<Campus> obtenerTodos() {
        return campusRepository.findAll();
    }

    // Comando para guardar un nuevo campus
    public Campus guardar(Campus campus) {
        // Aquí podríamos poner reglas (ej: validar que el nombre no esté vacío)
        return campusRepository.save(campus);
    }
    // Comando para eliminar un campus por su ID
    public void eliminar(Long id) {
        campusRepository.deleteById(id);
    }
    // Comando para actualizar un campus existente
    public Campus actualizar(Long id, Campus campusActualizado) {
        // Primero, buscamos si el campus existe en la despensa
        return campusRepository.findById(id).map(campusExistente -> {
            // Si existe, le actualizamos los datos
            campusExistente.setNombre(campusActualizado.getNombre());
            campusExistente.setMunicipio(campusActualizado.getMunicipio());
            // Y lo volvemos a guardar
            return campusRepository.save(campusExistente);
        }).orElseThrow(() -> new RuntimeException("Campus no encontrado con ID: " + id));
    }
}