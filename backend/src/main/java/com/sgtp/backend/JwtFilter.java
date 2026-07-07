package com.sgtp.backend;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String correo = null;
        String jwt = null;

        // 1. Verificamos si la petición trae el Pase VIP (Token)
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                correo = jwtUtil.extractClaims(jwt).getSubject();
            } catch (Exception e) {
                System.out.println("Firma de Token inválida o expirada");
            }
        }

        // 2. Si hay un correo y el usuario aún no está autenticado en este ciclo
        if (correo != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 3. la protección verifica si el Token es matemáticamente válido
            if (jwtUtil.isTokenValid(jwt)) {

                // 4. Se le otorgan los credenciales de acceso total a Spring Boot
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        correo, null, new ArrayList<>());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 5. Continúa el flujo normal hacia el Controlador
        chain.doFilter(request, response);
    }
}