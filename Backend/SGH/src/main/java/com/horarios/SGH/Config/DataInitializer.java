package com.horarios.SGH.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.horarios.SGH.Model.users;
import com.horarios.SGH.Repository.Iusers;

import org.springframework.boot.CommandLineRunner;

@Configuration
public class DataInitializer {

    @Value("${app.master.username:master}")
    private String masterUsername;

    @Value("${app.master.password:Master$2025!}")
    private String masterPassword;

    @Bean
    public CommandLineRunner seedMasterUser(Iusers repo, PasswordEncoder encoder) {
        return args -> {
            if (!repo.existsByUserName(masterUsername)) {
                users u = new users();
                u.setUserName(masterUsername);
                u.setPassword(encoder.encode(masterPassword));
                repo.save(u);
                System.out.println(">> Master creado: " + masterUsername);
            } else {
                System.out.println(">> Master ya existe: " + masterUsername);
            }
            long total = repo.count();
            System.out.println(">> Usuarios totales: " + total + " (máximo permitido: 2)");
        };
    }
}
