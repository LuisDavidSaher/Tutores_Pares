package com.sgtp.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Facultad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    // NUEVO CAMPO AGREGADO
    private String campus;

    public Facultad() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    // NUEVOS GETTER Y SETTER PARA CAMPUS
    public String getCampus() { return campus; }
    public void setCampus(String campus) { this.campus = campus; }
}