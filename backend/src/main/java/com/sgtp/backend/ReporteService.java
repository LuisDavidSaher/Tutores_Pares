package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private ReporteRepository repository;

    @Autowired
    private TutoriaRepository tutoriaRepository; // Necesario para el conteo secuencial

    @Autowired
    private EstudianteService estudianteService;

    public List<Reporte> obtenerTodos() {
        return repository.findAll();
    }

    public Reporte guardar(Reporte reporte) {

        // 1. FORJA DEL ID SECUENCIAL PARA EL REPORTE
        // Si el reporte no existe en la base de datos (es nuevo), le asignamos su ID real
        if (reporte.getId() == null || !repository.existsById(reporte.getId())) {
            long totalReportes = repository.count();
            reporte.setId(String.format("REP-%03d", totalReportes + 1));
        }

        if (reporte.getTutorias() != null) {
            // Obtenemos cuántas tutorías existen en total para continuar la secuencia
            long totalTutorias = tutoriaRepository.count();

            for (Tutoria tutoria : reporte.getTutorias()) {

                // 2. FORJA DEL ID SECUENCIAL PARA CADA TUTORÍA
                if (tutoria.getId() == null || !tutoriaRepository.existsById(tutoria.getId())) {
                    totalTutorias++;
                    tutoria.setId(String.format("TUT-%03d", totalTutorias));
                }

                // 3. BLINDAJE DE ESTUDIANTES HISTÓRICOS
                if (tutoria.getTutorDoc() != null) {
                    Estudiante tutor = new Estudiante();
                    tutor.setDocumento(tutoria.getTutorDoc());
                    tutor.setNombres(tutoria.getTutorNombre());

                    estudianteService.obtenerORegistrar(tutor);
                }
            }
        }

        return repository.save(reporte);
    }

    public Reporte actualizarEstado(String id, String nuevoEstado) {
        return repository.findById(id).map(reporte -> {
            reporte.setEstado(nuevoEstado);
            return repository.save(reporte);
        }).orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
    }
}