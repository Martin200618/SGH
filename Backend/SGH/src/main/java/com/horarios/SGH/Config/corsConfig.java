package com.horarios.SGH.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class corsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Permitir solicitudes desde estos orígenes específicos
        config.addAllowedOrigin("http://127.0.0.1:5500");
        config.addAllowedOrigin("http://localhost:5500");
        config.addAllowedOrigin("http://localhost:3000"); // Next.js
        config.addAllowedOrigin("http://10.3.226.178:19000"); // Expo Go
        config.addAllowedOrigin("http://10.3.226.178:8081");  // Metro bundler
        config.addAllowedOrigin("http://172.30.5.58:8085");  // Metro bundler


        // Métodos HTTP permitidos
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");

        // Encabezados permitidos
        config.addAllowedHeader("Authorization");
        config.addAllowedHeader("Content-Type");
        config.addAllowedHeader("*"); // Permitir todos los encabezados

        // Permitir credenciales (cookies, tokens, etc.)
        config.setAllowCredentials(true);

        // Registrar la configuración para todos los endpoints
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}