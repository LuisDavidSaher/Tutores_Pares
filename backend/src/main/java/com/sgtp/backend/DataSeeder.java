package com.sgtp.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (repository.count() == 0) {
                Usuario admin = new Usuario();
                admin.setCorreo("admin.prueba@unicartagena.edu.co");
                // La contraseña "123456" ahora se encripta con BCrypt antes de guardarse
                admin.setPassword(passwordEncoder.encode("123456"));
                admin.setRol("Administrador");
                repository.save(admin);

                System.out.println("Cuenta de Admin sembrada y encriptada con éxito en la BD.");
            }
        };
    }
}