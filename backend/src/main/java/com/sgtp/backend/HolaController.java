package com.sgtp.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaController {

    @GetMapping("/api/saludo")
    public String darLaBienvenida() {
        return "¡Larga vida al Rey! El backend de Spring Boot está vivo y respirando.";
    }
}