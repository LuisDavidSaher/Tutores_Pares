package com.sgtp.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // Esto le dice a Spring: "Crea una tabla en la base de datos para esto"
public class Campus {

    @Id // Esta es la llave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Autoincrementable (1, 2, 3...)
    private Long id;
    private String nombre;
    private String municipio;

    // --- Constructor vacío obligatorio ---
    public Campus() {}

    // --- Getters y Setters (Para que Java pueda leer y escribir los datos) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }
}