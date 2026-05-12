package com.sgtp.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class TutoradoDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBd;

    private Long idInterno;
    private String documento;
    private String tipoDoc;
    private String nombres;
    private String apellidos;
    private String genero;
    private String codigo;
    private String campus;
    private String facultad;
    private String programa;
    private String riesgo;
    private String promedioInicio;

    // --- NUEVOS CAMPOS PARA EL REPORTE FINAL (FASE 2) ---
    private String fechaInicio;
    private String fechaFin;
    private String totalSesiones;
    private String notaFinal;
    private String promedioFinal; // El indicador clave que solicitó
    private String cargadoSire;

    @Column(length = 2000) // Permite textos largos para las observaciones
    private String observaciones;

    public TutoradoDetalle() {}

    // --- Getters y Setters Fase 1 ---
    public Long getIdBd() { return idBd; }
    public void setIdBd(Long idBd) { this.idBd = idBd; }

    public Long getIdInterno() { return idInterno; }
    public void setIdInterno(Long idInterno) { this.idInterno = idInterno; }

    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    public String getTipoDoc() { return tipoDoc; }
    public void setTipoDoc(String tipoDoc) { this.tipoDoc = tipoDoc; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getCampus() { return campus; }
    public void setCampus(String campus) { this.campus = campus; }

    public String getFacultad() { return facultad; }
    public void setFacultad(String facultad) { this.facultad = facultad; }

    public String getPrograma() { return programa; }
    public void setPrograma(String programa) { this.programa = programa; }

    public String getRiesgo() { return riesgo; }
    public void setRiesgo(String riesgo) { this.riesgo = riesgo; }

    public String getPromedioInicio() { return promedioInicio; }
    public void setPromedioInicio(String promedioInicio) { this.promedioInicio = promedioInicio; }

    // --- Getters y Setters Fase 2 ---
    public String getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(String fechaInicio) { this.fechaInicio = fechaInicio; }

    public String getFechaFin() { return fechaFin; }
    public void setFechaFin(String fechaFin) { this.fechaFin = fechaFin; }

    public String getTotalSesiones() { return totalSesiones; }
    public void setTotalSesiones(String totalSesiones) { this.totalSesiones = totalSesiones; }

    public String getNotaFinal() { return notaFinal; }
    public void setNotaFinal(String notaFinal) { this.notaFinal = notaFinal; }

    public String getPromedioFinal() { return promedioFinal; }
    public void setPromedioFinal(String promedioFinal) { this.promedioFinal = promedioFinal; }

    public String getCargadoSire() { return cargadoSire; }
    public void setCargadoSire(String cargadoSire) { this.cargadoSire = cargadoSire; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}