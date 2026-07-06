package com.sgtp.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Programa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String facultad;
    private String campus;

    // NUEVO CAMPO AGREGADO
    private String modalidad;

    public Programa() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getFacultad() { return facultad; }
    public void setFacultad(String facultad) { this.facultad = facultad; }

    public String getCampus() { return campus; }
    public void setCampus(String campus) { this.campus = campus; }

    // --- GETTERS Y SETTERS DE MODALIDAD ---
    public String getModalidad() { return modalidad; }
    public void setModalidad(String modalidad) { this.modalidad = modalidad; }
}