package com.horarios.SGH.Config;

import com.horarios.SGH.jwt.JwtAuthenticationEntryPoint;
import com.horarios.SGH.jwt.JwtAuthenticationFilter;
import com.horarios.SGH.jwt.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(UserDetailsService userDetailsService,
                                                           JwtTokenProvider jwtTokenProvider) {
        return new JwtAuthenticationFilter(userDetailsService, jwtTokenProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // BCrypt para login con password en texto plano
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos (sin autenticación)
                .requestMatchers(
                    "/auth/**",          // login y register
                    "/teachers",         // GET profesores para dashboard
                    "/subjects/**",      // materias para dashboard
                    "/courses/**",       // cursos para dashboard
                    "/schedules/**",     // horarios para dashboard
                    "/schedules-crud/by-course/**",  // ver horarios de curso
                    "/schedules-crud/by-teacher/**", // ver horarios de profesor
                    "/schedules-crud",   // ver todos los horarios
                    "/schedules/history", // historial de horarios
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api-docs/**"
                ).permitAll()
                // Métodos que requieren autenticación
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/teachers/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/teachers/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/teachers/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/subjects/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/subjects/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/subjects/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/courses/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/courses/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/courses/**").authenticated()
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}