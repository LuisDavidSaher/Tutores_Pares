package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired private ProgramaRepository programaRepository;
    @Autowired private AsignaturaRepository asignaturaRepository;
    @Autowired private ReporteRepository reporteRepository;

    @GetMapping("/metricas")
    public Map<String, Object> obtenerMetricas(@RequestParam(required = false) String programa) {
        Map<String, Object> metricas = new HashMap<>();

        metricas.put("programas", programaRepository.count());
        metricas.put("asignaturas", asignaturaRepository.count());

        List<Reporte> todosLosReportes = reporteRepository.findAll();
        List<Reporte> reportesFiltrados = todosLosReportes;

        if (programa != null && !programa.isEmpty() && !programa.equals("MULTI-PROGRAMA (ADMIN)")) {
            reportesFiltrados = todosLosReportes.stream()
                    .filter(r -> programa.equals(r.getProgramaReporte()))
                    .toList();
        }

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
                    String asig = t.getAsignatura();
                    conteoAsignaturas.put(asig, conteoAsignaturas.getOrDefault(asig, 0L) + 1);

                    if (t.getTutoradosList() != null) {
                        tutorados += t.getTutoradosList().size();
                        for (TutoradoDetalle td : t.getTutoradosList()) {
                            //  NUEVO ALGORITMO DE RIESGO: Detecta repitencias, condicionales y riesgo alto
                            String riesgoStr = td.getRiesgo() != null ? td.getRiesgo().toUpperCase() : "";
                            if (riesgoStr.contains("ALTO") || riesgoStr.contains("CONDICIONAL") || riesgoStr.contains("REPETIC")) {
                                riesgoAlto++;
                            } else if (!riesgoStr.isEmpty()) {
                                riesgoBajo++;
                            }
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

        List<Map<String, Object>> topProgramas = conteoProgramas.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue())).limit(10)
                .map(e -> { Map<String, Object> map = new HashMap<>(); map.put("nombre", e.getKey()); map.put("cantidad", e.getValue()); return map; }).toList();

        List<Map<String, Object>> topAsignaturas = conteoAsignaturas.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue())).limit(10)
                .map(e -> { Map<String, Object> map = new HashMap<>(); map.put("nombre", e.getKey()); map.put("cantidad", e.getValue()); return map; }).toList();

        metricas.put("topProgramas", topProgramas);
        metricas.put("topAsignaturas", topAsignaturas);

        return metricas;
    }
}