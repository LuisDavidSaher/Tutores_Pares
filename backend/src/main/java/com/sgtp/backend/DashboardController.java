package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired private ProgramaRepository programaRepository;
    @Autowired private AsignaturaRepository asignaturaRepository;
    @Autowired private ReporteRepository reporteRepository;

    // Repositorios mantenidos por compatibilidad, aunque ahora todo se lee desde los Reportes
    @Autowired private TutoradoDetalleRepository tutoradoRepository;
    @Autowired private TutoriaRepository tutoriaRepository;

    @GetMapping("/metricas")
    public Map<String, Object> obtenerMetricas(@RequestParam(required = false) String programa) {
        Map<String, Object> metricas = new HashMap<>();

        // 1. MÉTRICAS GENERALES DE CATÁLOGO
        metricas.put("programas", programaRepository.count());
        metricas.put("asignaturas", asignaturaRepository.count());

        // 2. OBTENER Y FILTRAR REPORTES (El corazón del sistema)
        List<Reporte> todosLosReportes = reporteRepository.findAll();
        List<Reporte> reportesFiltrados = todosLosReportes;

        // Si hay un programa específico (Jefe de Departamento), filtramos
        if (programa != null && !programa.isEmpty() && !programa.equals("MULTI-PROGRAMA (ADMIN)")) {
            reportesFiltrados = todosLosReportes.stream()
                    .filter(r -> programa.equals(r.getProgramaReporte()))
                    .toList();
        }

        // 3. PROCESAMIENTO MATEMÁTICO DE DATOS REALES
        long tutores = 0;
        long tutorados = 0;
        long riesgoAlto = 0;
        long riesgoBajo = 0;
        long completados = 0;
        long pendientes = 0;

        Map<String, Long> conteoProgramas = new HashMap<>();
        Map<String, Long> conteoAsignaturas = new HashMap<>();

        for (Reporte r : reportesFiltrados) {
            if ("Final".equals(r.getEstado())) completados++;
            if ("Inicial".equals(r.getEstado())) pendientes++;

            String prog = r.getProgramaReporte();
            long tutoresEnEsteReporte = r.getTutorias() != null ? r.getTutorias().size() : 0;
            conteoProgramas.put(prog, conteoProgramas.getOrDefault(prog, 0L) + tutoresEnEsteReporte);

            if (r.getTutorias() != null) {
                tutores += tutoresEnEsteReporte;
                for (Tutoria t : r.getTutorias()) {
                    // Contabilizar Asignaturas
                    String asig = t.getAsignatura();
                    conteoAsignaturas.put(asig, conteoAsignaturas.getOrDefault(asig, 0L) + 1);

                    // Contabilizar Tutorados y Riesgos
                    if (t.getTutoradosList() != null) {
                        tutorados += t.getTutoradosList().size();
                        for (TutoradoDetalle td : t.getTutoradosList()) {
                            if ("ALTO".equals(td.getRiesgo())) riesgoAlto++;
                            if ("BAJO".equals(td.getRiesgo())) riesgoBajo++;
                        }
                    }
                }
            }
        }

        metricas.put("tutoresActivos", tutores);
        metricas.put("tutoradosActivos", tutorados);
        metricas.put("riesgoAlto", riesgoAlto);
        metricas.put("riesgoBajo", riesgoBajo);
        metricas.put("reportesCompletados", completados);
        metricas.put("reportesPendientes", pendientes);

        // 4. TOP PROGRAMAS Y ASIGNATURAS 
        List<Map<String, Object>> topProgramas = conteoProgramas.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("nombre", e.getKey());
                    map.put("cantidad", e.getValue());
                    return map;
                })
                .toList();

        List<Map<String, Object>> topAsignaturas = conteoAsignaturas.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("nombre", e.getKey());
                    map.put("cantidad", e.getValue());
                    return map;
                })
                .toList();

        metricas.put("topProgramas", topProgramas);
        metricas.put("topAsignaturas", topAsignaturas);

        return metricas;
    }
}