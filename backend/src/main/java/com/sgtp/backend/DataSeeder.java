package com.sgtp.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository repository) {
        return args -> {
            // Solo creamos los usuarios si la tabla está vacía
            if (repository.count() == 0) {

                // 1. Crear el Administrador
                Usuario admin = new Usuario();
                admin.setCorreo("admin.prueba@unicartagena.edu.co");
                admin.setPassword("123456"); // Contraseña por defecto
                admin.setRol("Administrador");
                repository.save(admin);

                // 2. Crear el Jefe de Sistemas
                Usuario jefe = new Usuario();
                jefe.setCorreo("jefe.sistemas@unicartagena.edu.co");
                jefe.setPassword("123456"); // Contraseña por defecto
                jefe.setRol("Jefe de Departamento");
                jefe.setPrograma("INGENIERÍA DE SISTEMAS");
                repository.save(jefe);

                System.out.println("🛡️ Cuentas de Admin y Jefe sembradas con éxito en la BD.");
            }
        };
    }
}