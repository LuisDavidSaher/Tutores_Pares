package com.sgtp.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String correo = credentials.get("correo");
        String password = credentials.get("password");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // Validación criptográfica estricta con BCrypt
            if (passwordEncoder.matches(password, usuario.getPassword())) {

                String token = jwtUtil.generateToken(usuario.getCorreo(), usuario.getRol());

                Map<String, Object> response = new HashMap<>();
                response.put("mensaje", "Autenticación exitosa");
                response.put("token", token);
                response.put("rol", usuario.getRol());
                response.put("programa", usuario.getPrograma());

                return ResponseEntity.ok(response);
            }
        }

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("mensaje", "Credenciales inválidas");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
}