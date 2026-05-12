package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/datos")
@CrossOrigin(origins = "http://localhost:5173")
public class GestionDatosController {

    @Autowired
    private TutoriaRepository tutoriaRepository;

    @Autowired
    private TutoradoDetalleRepository tutoradoDetalleRepository;

    @GetMapping("/tutores")
    public List<Map<String, Object>> obtenerTutores() {
        List<Map<String, Object>> lista = new ArrayList<>();
        List<Tutoria> tutorias = tutoriaRepository.findAll();

        for (Tutoria t : tutorias) {
            // Verificamos que tenga un documento de tutor válido
            if (t.getTutorDoc() != null && !t.getTutorDoc().isEmpty()) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", t.getId());
                map.put("documento", t.getTutorDoc());
                // En su tabla Tutoria, el nombre completo se guarda en una sola variable
                map.put("nombres", t.getTutorNombre());
                map.put("apellidos", "");
                map.put("programa", "N/A"); // Nota: Tutoria no guarda el programa del tutor actualmente
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
            // Verificamos que el detalle tenga un documento
            if (d.getDocumento() != null && !d.getDocumento().isEmpty()) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", d.getIdBd());
                map.put("documento", d.getDocumento());
                map.put("nombres", d.getNombres());
                map.put("apellidos", d.getApellidos());
                map.put("programa", d.getPrograma());
                map.put("periodo", "2026-I");
                // Usamos sus getters exactos
                map.put("riesgo", d.getRiesgo());
                map.put("promedio", d.getPromedioInicio());
                lista.add(map);
            }
        }
        return lista;
    }
}