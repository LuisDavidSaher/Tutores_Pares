package com.sgtp.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class Reporte {
    @Id
    private String id; // Ej: REP-1234 (Viene de React)

    private String periodo;
    private String programaReporte;
    private String estado; // "Inicial" o "Final"

    // Un Reporte tiene MUCHAS Tutorías
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "reporte_id")
    private List<Tutoria> tutorias = new ArrayList<>();

    public Reporte() {}

    // --- Getters y Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPeriodo() { return periodo; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }
    public String getProgramaReporte() { return programaReporte; }
    public void setProgramaReporte(String programaReporte) { this.programaReporte = programaReporte; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public List<Tutoria> getTutorias() { return tutorias; }
    public void setTutorias(List<Tutoria> tutorias) { this.tutorias = tutorias; }
}