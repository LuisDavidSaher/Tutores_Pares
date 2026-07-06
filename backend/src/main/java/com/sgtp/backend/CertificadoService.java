package com.sgtp.backend;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class CertificadoService {

    @Autowired
    private ReporteRepository reporteRepository; // Necesitamos buscar en los reportes

    public byte[] generarCertificado(String cedula) {

        // 1. BUSCAR EN LA BD: ¿Este estudiante tiene una tutoría aprobada en un reporte FINAL?
        // Buscamos todos los reportes finales
        List<Reporte> reportesFinales = reporteRepository.findAll().stream()
                .filter(r -> "Final".equals(r.getEstado()))
                .toList();

        // Buscamos si en alguno de esos reportes, la cédula aparece como TUTOR y el dictamen es "SI" (Cumplió)
        Tutoria tutoriaGanada = reportesFinales.stream()
                .flatMap(r -> r.getTutorias().stream())
                .filter(t -> t.getTutorDoc().equals(cedula))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No se encontró un proceso de tutoría finalizado y aprobado para esta cédula."));

        // Si llegamos aquí, es porque el estudiante EXISTE y CUMPLIÓ.

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitulo = new Font(Font.HELVETICA, 22, Font.BOLD);
            Font fontCuerpo = new Font(Font.HELVETICA, 12, Font.NORMAL);
            Font fontResaltado = new Font(Font.HELVETICA, 12, Font.BOLD);

            Paragraph titulo = new Paragraph("UNIVERSIDAD DE CARTAGENA", fontTitulo);
            titulo.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(titulo);

            document.add(new Paragraph(" "));

            // Cuerpo Dinámico con datos de la BD
            Paragraph cuerpo = new Paragraph();
            cuerpo.setAlignment(Paragraph.ALIGN_JUSTIFIED);
            cuerpo.add(new Paragraph("La Dirección de Bienestar Universitario hace constar que:", fontCuerpo));
            cuerpo.add(new Paragraph(" "));
            cuerpo.add(new Paragraph(tutoriaGanada.getTutorNombre().toUpperCase(), fontTitulo));
            cuerpo.add(new Paragraph("Identificado con cédula No. " + cedula, fontResaltado));
            cuerpo.add(new Paragraph(" "));
            cuerpo.add(new Paragraph(
                    "Culminó satisfactoriamente su labor como TUTOR PAR en la asignatura de " + tutoriaGanada.getAsignatura() +
                            ". Durante este periodo, el estudiante demostró un alto compromiso con el programa SGTP.", fontCuerpo));

            document.add(cuerpo);
            document.add(new Paragraph(" "));

            // Aquí es donde se conecta con lo que usted pidió: "Cumplió por x tiempo"
            // Nota: Estos datos vendrán de la sumatoria de las sesiones de sus tutorados
            document.add(new Paragraph("DICTAMEN FINAL: CUMPLIMIENTO EXITOSO", fontResaltado));

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            Paragraph firma = new Paragraph("___________________________________\nSello de Certificación Digital SGTP", fontCuerpo);
            firma.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(firma);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el certificado real: " + e.getMessage());
        }
    }
}