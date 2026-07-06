package com.sgtp.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class Tutoria {
    @Id
    private String id; // Ej: TUT-1234 (Viene de React)

    private String tutorDoc;
    private String tutorNombre;
    private String asignatura;
    private Integer numeroTutorados;
    private String dictamen;

    // Aquí está la magia: Una Tutoría tiene MUCHOS Tutorados
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "tutoria_id") // Crea la llave foránea automáticamente
    private List<TutoradoDetalle> tutoradosList = new ArrayList<>();

    public Tutoria() {}

    // --- Getters y Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTutorDoc() { return tutorDoc; }
    public void setTutorDoc(String tutorDoc) { this.tutorDoc = tutorDoc; }
    public String getTutorNombre() { return tutorNombre; }
    public void setTutorNombre(String tutorNombre) { this.tutorNombre = tutorNombre; }
    public String getAsignatura() { return asignatura; }
    public void setAsignatura(String asignatura) { this.asignatura = asignatura; }
    public Integer getNumeroTutorados() { return numeroTutorados; }
    public void setNumeroTutorados(Integer numeroTutorados) { this.numeroTutorados = numeroTutorados; }
    public List<TutoradoDetalle> getTutoradosList() { return tutoradosList; }
    public void setTutoradosList(List<TutoradoDetalle> tutoradosList) { this.tutoradosList = tutoradosList; }
    public String getDictamen() { return dictamen;}
    public void setDictamen(String dictamen) { this.dictamen = dictamen; }
}