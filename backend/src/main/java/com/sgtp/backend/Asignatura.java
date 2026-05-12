package com.sgtp.backend;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Asignatura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codigo;
    private String nombre;
    private String facultad;

    @ElementCollection // <- Hechizo para guardar listas de Strings simples
    private List<String> programas;

    public Asignatura() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getFacultad() { return facultad; }
    public void setFacultad(String facultad) { this.facultad = facultad; }
    public List<String> getProgramas() { return programas; }
    public void setProgramas(List<String> programas) { this.programas = programas; }
}