package com.sgtp.backend;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class DataLoaderService {

    private final ReporteRepository reporteRepository;
    private final EstudianteRepository estudianteRepository;
    private final DataFormatter dataFormatter;

    public DataLoaderService(ReporteRepository reporteRepository, EstudianteRepository estudianteRepository) {
        this.reporteRepository = reporteRepository;
        this.estudianteRepository = estudianteRepository;
        this.dataFormatter = new DataFormatter();
    }

    public void procesarExcel(MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Map<String, Reporte> mapaReportesLocal = new HashMap<>();
            Map<String, Tutoria> mapaTutoriasLocal = new HashMap<>();
            Set<String> cacheEstudiantes = new HashSet<>();

            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                Sheet sheet = workbook.getSheetAt(i);

                String periodoMemoria = "INDEFINIDO";
                String tutorDocMemoria = "";
                String tutorNombreMemoria = "";
                String tutorProgramaMemoria = "";
                String asignaturaMemoria = "NO REGISTRADA";

                for (Row row : sheet) {
                    if (row == null) continue;

                    String checkFilaCero = getSafeString(row.getCell(0), 250);
                    String checkFilaUno = getSafeString(row.getCell(2), 250);

                    if (checkFilaCero.toLowerCase().contains("información") ||
                            checkFilaUno.toLowerCase().contains("nombre completo") ||
                            checkFilaCero.toLowerCase().contains("lista de")) {
                        continue;
                    }

                    String celdaDocTutor = getPrimeraLinea(getSafeString(row.getCell(3), 50)).replaceAll("\\D+", "");

                    if (!celdaDocTutor.isEmpty() && !celdaDocTutor.equals("0") && celdaDocTutor.matches("\\d+")) {

                        tutorNombreMemoria = getPrimeraLinea(getSafeString(row.getCell(2), 250));

                        // MURO DE CONTENCIÓN: Descartar documentos huérfanos sin nombre asignado
                        if (tutorNombreMemoria.isEmpty() || tutorNombreMemoria.length() < 3) {
                            continue;
                        }

                        String periodoLeido = getSafeString(row.getCell(1), 50);
                        if (!periodoLeido.isEmpty()) {
                            String p = periodoLeido.toUpperCase().replace("P", "").trim();
                            periodoMemoria = p.replace(" ", "-");
                        }

                        tutorDocMemoria = celdaDocTutor;
                        String tutorGenero = getPrimeraLinea(getSafeString(row.getCell(4), 20)).toUpperCase();
                        tutorProgramaMemoria = normalizarCadenaTexto(getPrimeraLinea(getSafeString(row.getCell(6), 250)));
                        String tutorCodigo = getPrimeraLinea(getSafeString(row.getCell(7), 50));
                        String tutorCampus = normalizarCadenaTexto(getPrimeraLinea(getSafeString(row.getCell(8), 100)));
                        String tutorCorreo = getPrimeraLinea(getSafeString(row.getCell(9), 250)).toLowerCase();

                        String asigLeida = normalizarCadenaTexto(getPrimeraLinea(getSafeString(row.getCell(12), 250)));
                        asignaturaMemoria = !asigLeida.isEmpty() ? asigLeida : "NO REGISTRADA";

                        registrarEstudianteDefensivo(tutorDocMemoria, tutorNombreMemoria, tutorGenero, tutorProgramaMemoria, tutorCodigo, tutorCampus, tutorCorreo, cacheEstudiantes);

                        String nombreProgramaFiltro = (!tutorProgramaMemoria.isEmpty()) ? tutorProgramaMemoria.toUpperCase().trim() : "GENERAL";
                        String reporteId = "REP-" + periodoMemoria + "-" + nombreProgramaFiltro.replace(" ", "_");

                        Reporte reporte = mapaReportesLocal.get(reporteId);
                        if (reporte == null) {
                            Optional<Reporte> repoDbOpt = reporteRepository.findById(reporteId);
                            if (repoDbOpt.isPresent()) {
                                reporte = repoDbOpt.get();
                            } else {
                                reporte = new Reporte();
                                reporte.setId(reporteId);
                                reporte.setPeriodo(periodoMemoria);
                                reporte.setProgramaReporte(nombreProgramaFiltro);
                                reporte.setEstado("Final");
                                reporte.setTutorias(new ArrayList<>());
                            }
                            mapaReportesLocal.put(reporteId, reporte);
                        }

                        String tutoriaId = "TUT-" + tutorDocMemoria + "-H" + i + "F" + row.getRowNum();
                        Tutoria tutoria = new Tutoria();
                        tutoria.setId(tutoriaId);
                        tutoria.setTutorDoc(tutorDocMemoria);
                        tutoria.setTutorNombre(tutorNombreMemoria);
                        tutoria.setAsignatura(asignaturaMemoria);
                        tutoria.setDictamen("SI");
                        tutoria.setNumeroTutorados(0);
                        tutoria.setTutoradosList(new ArrayList<>());

                        mapaTutoriasLocal.put(tutorDocMemoria, tutoria);
                        reporte.getTutorias().add(tutoria);
                    }

                    String tutoradoDoc = getPrimeraLinea(getSafeString(row.getCell(23), 50)).replaceAll("\\D+", "");
                    String tutoradoNombreCompleto = getPrimeraLinea(getSafeString(row.getCell(22), 250));

                    if (!tutoradoDoc.isEmpty() && !tutoradoDoc.equals("0") && tutoradoDoc.matches("\\d+") &&
                            !tutoradoNombreCompleto.isEmpty() && tutoradoNombreCompleto.length() > 3) {

                        String tutoradoGenero = getPrimeraLinea(getSafeString(row.getCell(24), 20)).toUpperCase();
                        String tutoradoCorreo = getPrimeraLinea(getSafeString(row.getCell(25), 250)).toLowerCase();
                        String tutoradoCodigo = getPrimeraLinea(getSafeString(row.getCell(26), 50));
                        String tutoradoPrograma = normalizarCadenaTexto(getPrimeraLinea(getSafeString(row.getCell(27), 250)));
                        String tutoradoCampus = normalizarCadenaTexto(getPrimeraLinea(getSafeString(row.getCell(28), 100)));
                        String tutoradoRiesgo = getPrimeraLinea(getSafeString(row.getCell(29), 100)).toUpperCase();
                        String tutoradoPromInicio = getPrimeraLinea(getSafeString(row.getCell(30), 20));
                        String tutoradoPromFinal = getPrimeraLinea(getSafeString(row.getCell(31), 20));

                        String fechaInicio = getPrimeraLinea(getSafeString(row.getCell(38), 50));
                        String fechaFin = getPrimeraLinea(getSafeString(row.getCell(39), 50));
                        String totalSesiones = getPrimeraLinea(getSafeString(row.getCell(40), 20));
                        String reporteSire = getPrimeraLinea(getSafeString(row.getCell(41), 20)).toUpperCase();
                        String observaciones = getPrimeraLinea(getSafeString(row.getCell(42), 250));

                        registrarEstudianteDefensivo(tutoradoDoc, tutoradoNombreCompleto, tutoradoGenero, tutoradoPrograma, tutoradoCodigo, tutoradoCampus, tutoradoCorreo, cacheEstudiantes);

                        TutoradoDetalle detalle = new TutoradoDetalle();
                        detalle.setDocumento(tutoradoDoc);

                        String[] partesTutorado = separarNombres(tutoradoNombreCompleto);
                        detalle.setNombres(partesTutorado[0]);
                        detalle.setApellidos(partesTutorado[1]);

                        detalle.setPrograma(tutoradoPrograma);
                        detalle.setCampus(tutoradoCampus);
                        detalle.setCodigo(tutoradoCodigo);
                        detalle.setRiesgo(tutoradoRiesgo.isEmpty() ? "BAJO RENDIMIENTO" : tutoradoRiesgo);
                        detalle.setPromedioInicio(tutoradoPromInicio);
                        detalle.setPromAcumFinal(tutoradoPromFinal);
                        detalle.setFechaInicio(fechaInicio);
                        detalle.setFechaFin(fechaFin);
                        detalle.setTotalSesiones(totalSesiones);
                        detalle.setCargadoSire(reporteSire.isEmpty() ? "SI" : reporteSire);
                        detalle.setObservaciones(observaciones);

                        Tutoria tutoriaActiva = mapaTutoriasLocal.get(tutorDocMemoria);
                        if (tutoriaActiva != null) {
                            tutoriaActiva.getTutoradosList().add(detalle);
                            tutoriaActiva.setNumeroTutorados(tutoriaActiva.getTutoradosList().size());
                        }
                    }
                }
            }

            if (!mapaReportesLocal.isEmpty()) {
                reporteRepository.saveAll(mapaReportesLocal.values());
            }
        }
    }

    private void registrarEstudianteDefensivo(String doc, String nombreCompleto, String genero, String programa, String codigo, String campus, String correo, Set<String> cache) {
        if (doc == null || doc.trim().isEmpty() || doc.equals("0") || !doc.matches("\\d+")) return;

        if (cache.contains(doc) || estudianteRepository.existsById(doc)) {
            cache.add(doc);
            return;
        }

        String[] partes = separarNombres(nombreCompleto);

        Estudiante est = new Estudiante();
        est.setDocumento(doc);
        est.setNombres(partes[0]);
        est.setApellidos(partes[1]);
        est.setTipoDoc("CC");
        est.setGenero(genero.isEmpty() ? "M" : genero);
        est.setPrograma(programa.isEmpty() ? "NO REGISTRADO" : programa);
        est.setCodigo(codigo);
        est.setCampus(campus.isEmpty() ? "CARTAGENA" : campus);
        est.setCorreo(correo);

        try {
            estudianteRepository.saveAndFlush(est);
            cache.add(doc);
        } catch (Exception e) {
            cache.add(doc);
        }
    }

    private String getPrimeraLinea(String texto) {
        if (texto == null || texto.trim().isEmpty()) return "";
        return texto.split("\n")[0].trim();
    }

    private String normalizarCadenaTexto(String entrada) {
        if (entrada == null || entrada.trim().isEmpty()) return "";

        String limpia = entrada.trim().toUpperCase();
        limpia = Normalizer.normalize(limpia, Normalizer.Form.NFD);
        limpia = limpia.replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");

        if (limpia.startsWith("ING ") || limpia.startsWith("ING. ")) {
            limpia = limpia.replace("ING. ", "INGENIERIA ").replace("ING ", "INGENIERIA ");
        }

        return limpia;
    }

    private String[] separarNombres(String nombreCompleto) {
        if (nombreCompleto == null || nombreCompleto.trim().isEmpty()) return new String[]{"", ""};

        String[] partes = nombreCompleto.trim().split("\\s+");
        String nombres = "";
        String apellidos = "";

        if (partes.length == 1) {
            nombres = partes[0];
        } else if (partes.length == 2) {
            nombres = partes[0];
            apellidos = partes[1];
        } else if (partes.length == 3) {
            nombres = partes[0];
            apellidos = partes[1] + " " + partes[2];
        } else {
            nombres = partes[0] + " " + partes[1];
            apellidos = partes[2];
            for (int i = 3; i < partes.length; i++) {
                apellidos += " " + partes[i];
            }
        }
        return new String[]{nombres, apellidos};
    }

    private String getSafeString(Cell cell, int maxLength) {
        if (cell == null) return "";
        try {
            String val = dataFormatter.formatCellValue(cell).trim();
            if (val.length() > maxLength) {
                return val.substring(0, maxLength);
            }
            return val;
        } catch (Exception e) {
            return "";
        }
    }
}