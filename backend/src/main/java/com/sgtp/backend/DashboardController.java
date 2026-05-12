package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired private ProgramaRepository programaRepository;
    @Autowired private AsignaturaRepository asignaturaRepository;
    @Autowired private EstudianteRepository estudianteRepository;

    // Inyectamos los nuevos repositorios
    @Autowired private ReporteRepository reporteRepository;
    @Autowired private TutoradoDetalleRepository tutoradoRepository;

    @GetMapping("/metricas")
    public Map<String, Object> obtenerMetricas() {
        Map<String, Object> metricas = new HashMap<>();

        // 1. MÉTRICAS GENERALES
        metricas.put("programas", programaRepository.count());
        metricas.put("asignaturas", asignaturaRepository.count());

        long totalEstudiantes = estudianteRepository.count();
        // Nota: Hasta que no separemos en BD quién tiene rol de tutor o tutorado, hacemos un cálculo temporal
        metricas.put("tutoresActivos", totalEstudiantes > 0 ? (totalEstudiantes / 3) : 0);
        metricas.put("tutoradosActivos", totalEstudiantes > 0 ? (totalEstudiantes - (totalEstudiantes / 3)) : 0);

        // 2. MÉTRICAS 100% REALES DE REPORTES Y RIESGOS
        metricas.put("riesgoAlto", tutoradoRepository.countByRiesgo("ALTO"));
        metricas.put("riesgoBajo", tutoradoRepository.countByRiesgo("BAJO"));
        metricas.put("reportesCompletados", reporteRepository.countByEstado("Final"));
        metricas.put("reportesPendientes", reporteRepository.countByEstado("Inicial"));

        return metricas;
    }
}