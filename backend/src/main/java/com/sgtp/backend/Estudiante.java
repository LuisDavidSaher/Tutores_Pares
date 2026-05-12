package com.sgtp.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Estudiante {

    @Id // El documento será el identificador único en la base de datos
    private String documento;

    private String tipoDoc;
    private String nombres;
    private String apellidos;
    private String genero;
    private String codigo;
    private String campus;
    private String facultad;
    private String programa;
    private String correo;

    // Constructor vacío obligatorio
    public Estudiante() {}

    // Getters y Setters
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
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
}