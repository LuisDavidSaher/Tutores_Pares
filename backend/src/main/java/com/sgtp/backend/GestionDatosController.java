package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/datos")
@CrossOrigin(origins = "*")
public class GestionDatosController {

    @Autowired private ReporteRepository reporteRepository;
    @Autowired private EstudianteRepository estudianteRepository;

    @GetMapping("/tutores")
    public List<Map<String, Object>> obtenerTutores() {
        Map<String, Map<String, Object>> mapaTutores = new HashMap<>();
        List<Reporte> reportes = reporteRepository.findAll();

        for (Reporte r : reportes) {
            if (r.getTutorias() != null) {
                for (Tutoria t : r.getTutorias()) {
                    String doc = t.getTutorDoc();

                    if (doc == null || doc.trim().isEmpty() || doc.equals("0") || doc.length() < 5) {
                        continue;
                    }

                    // MURO VISUAL: Ocultar registros sin nombre
                    String nombreRevisado = t.getTutorNombre();
                    if (nombreRevisado == null || nombreRevisado.trim().isEmpty() || nombreRevisado.length() < 3) {
                        continue;
                    }

                    String per = r.getPeriodo();
                    if (per == null || per.trim().isEmpty() || per.equals("6") || per.length() < 3) {
                        continue;
                    }

                    if (mapaTutores.containsKey(doc)) {
                        Map<String, Object> existente = mapaTutores.get(doc);

                        String periodosExistentes = (String) existente.get("periodo");
                        if (!periodosExistentes.contains(per)) {
                            existente.put("periodo", periodosExistentes + ", " + per);
                        }

                        String asigExistentes = (String) existente.get("asignaturas");
                        String nuevaAsig = t.getAsignatura();
                        if (nuevaAsig != null && !nuevaAsig.isEmpty() && !asigExistentes.contains(nuevaAsig)) {
                            existente.put("asignaturas", asigExistentes + ", " + nuevaAsig);
                        }
                    } else {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", t.getId());
                        map.put("documento", doc);

                        Optional<Estudiante> estOpt = estudianteRepository.findById(doc);
                        if (estOpt.isPresent()) {
                            Estudiante tutorReal = estOpt.get();
                            map.put("nombres", tutorReal.getNombres());
                            map.put("apellidos", tutorReal.getApellidos());
                            map.put("programa", tutorReal.getPrograma());
                        } else {
                            map.put("nombres", nombreRevisado);
                            map.put("apellidos", "");
                            map.put("programa", r.getProgramaReporte());
                        }

                        map.put("periodo", per);
                        map.put("asignaturas", t.getAsignatura() != null ? t.getAsignatura() : "NO REGISTRADA");
                        map.put("estado", "ACTIVO");
                        mapaTutores.put(doc, map);
                    }
                }
            }
        }
        return new ArrayList<>(mapaTutores.values());
    }

    @GetMapping("/tutorados")
    public List<Map<String, Object>> obtenerTutorados() {
        Map<String, Map<String, Object>> mapaTutorados = new HashMap<>();
        List<Reporte> reportes = reporteRepository.findAll();

        for (Reporte r : reportes) {
            if (r.getTutorias() != null) {
                for (Tutoria t : r.getTutorias()) {
                    if (t.getTutoradosList() != null) {
                        for (TutoradoDetalle d : t.getTutoradosList()) {
                            String doc = d.getDocumento();

                            if (doc == null || doc.trim().isEmpty() || doc.equals("0") || doc.length() < 5) {
                                continue;
                            }

                            // MURO VISUAL: Ocultar tutorados fantasma sin nombre
                            String nombreRevisado = d.getNombres();
                            if (nombreRevisado == null || nombreRevisado.trim().isEmpty()) {
                                continue;
                            }

                            String per = r.getPeriodo();
                            if (per == null || per.trim().isEmpty() || per.equals("6") || per.length() < 3) {
                                continue;
                            }

                            if (mapaTutorados.containsKey(doc)) {
                                Map<String, Object> existente = mapaTutorados.get(doc);

                                String periodosExistentes = (String) existente.get("periodo");
                                if (!periodosExistentes.contains(per)) {
                                    existente.put("periodo", periodosExistentes + ", " + per);
                                }
                            } else {
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", d.getIdBd() != null ? d.getIdBd() : System.currentTimeMillis() % 10000);
                                map.put("documento", doc);
                                map.put("nombres", nombreRevisado);
                                map.put("apellidos", d.getApellidos());
                                map.put("programa", d.getPrograma());
                                map.put("periodo", per);
                                map.put("riesgo", d.getRiesgo());
                                map.put("promedio", d.getPromedioInicio());
                                mapaTutorados.put(doc, map);
                            }
                        }
                    }
                }
            }
        }
        return new ArrayList<>(mapaTutorados.values());
    }
}