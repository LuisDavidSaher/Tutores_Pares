package com.sgtp.backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fechaHora; // Guardará la fecha y hora exacta automáticamente
    private String usuario;          // Ej: "Jefe de Departamento" o el correo cuando usemos Supabase
    private String modulo;           // Ej: "GESTIÓN ACADÉMICA" o "REPORTES"
    private String accion;           // Ej: "CREACIÓN", "EDICIÓN", "ELIMINACIÓN"
    private String detalle;          // Ej: "Se registró el campus ZARAGOCILLA"
    private String estado;           // Ej: "Éxito" o "Alerta"

    // Este proceso hace que Java ponga la hora exacta del servidor justo antes de guardar en la BD
    @PrePersist
    protected void onCreate() {
        this.fechaHora = LocalDateTime.now();
    }

    public Auditoria() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public String getModulo() { return modulo; }
    public void setModulo(String modulo) { this.modulo = modulo; }
    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }
    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}