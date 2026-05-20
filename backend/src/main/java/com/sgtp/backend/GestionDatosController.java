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

    @Autowired
    private TutoriaRepository tutoriaRepository;

    @Autowired
    private TutoradoDetalleRepository tutoradoDetalleRepository;

    // Agregamos el repositorio de estudiantes para cruzar los datos
    @Autowired
    private EstudianteRepository estudianteRepository;

    @GetMapping("/tutores")
    public List<Map<String, Object>> obtenerTutores() {
        List<Map<String, Object>> lista = new ArrayList<>();
        List<Tutoria> tutorias = tutoriaRepository.findAll();

        for (Tutoria t : tutorias) {
            if (t.getTutorDoc() != null && !t.getTutorDoc().isEmpty()) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", t.getId());
                map.put("documento", t.getTutorDoc());

                // ⚔️ CRUCE DE DATOS: Buscamos al estudiante real usando su documento
                Optional<Estudiante> estudianteOpt = estudianteRepository.findById(t.getTutorDoc());

                if (estudianteOpt.isPresent()) {
                    Estudiante tutorReal = estudianteOpt.get();
                    map.put("nombres", tutorReal.getNombres());
                    map.put("apellidos", tutorReal.getApellidos());
                    map.put("programa", tutorReal.getPrograma());
                } else {
                    // Si por algún motivo el estudiante fue borrado de la BD principal
                    map.put("nombres", t.getTutorNombre());
                    map.put("apellidos", "NO REGISTRADO");
                    map.put("programa", "NO REGISTRADO");
                }

                map.put("periodo", "2026-I");
                map.put("asignaturas", t.getAsignatura());
                map.put("estado", "ACTIVO");
                lista.add(map);
            }
        }
        return lista;
    }

    @GetMapping("/tutorados")
    public List<Map<String, Object>> obtenerTutorados() {
        List<Map<String, Object>> lista = new ArrayList<>();
        List<TutoradoDetalle> detalles = tutoradoDetalleRepository.findAll();

        for (TutoradoDetalle d : detalles) {
            if (d.getDocumento() != null && !d.getDocumento().isEmpty()) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", d.getIdBd());
                map.put("documento", d.getDocumento());
                map.put("nombres", d.getNombres());
                map.put("apellidos", d.getApellidos());
                map.put("programa", d.getPrograma());
                map.put("periodo", "2026-I");
                map.put("riesgo", d.getRiesgo());
                map.put("promedio", d.getPromedioInicio());
                lista.add(map);
            }
        }
        return lista;
    }
}