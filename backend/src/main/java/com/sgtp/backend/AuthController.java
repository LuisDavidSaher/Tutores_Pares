package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario credenciales) {
        Optional<Usuario> usuario = usuarioRepository.findByCorreo(credenciales.getCorreo());

        // Si el usuario existe y la contraseña coincide
        if (usuario.isPresent() && usuario.get().getPassword().equals(credenciales.getPassword())) {
            return ResponseEntity.ok(usuario.get());
        }

        // Si falla, devolvemos un error 401 (No autorizado)
        return ResponseEntity.status(401).body("Credenciales incorrectas o usuario no registrado.");
    }
}