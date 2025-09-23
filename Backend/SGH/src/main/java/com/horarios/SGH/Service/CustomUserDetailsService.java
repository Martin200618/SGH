package com.horarios.SGH.Service;

import com.horarios.SGH.Model.users;
import com.horarios.SGH.Repository.Iusers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Value("${app.master.username}")
    private String masterUsername;

    @Value("${app.master.password}")
    private String masterPassword;

    private final Iusers userRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomUserDetailsService(Iusers userRepository,
                                    PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1) Intentar cargar desde BD
        users u = userRepository.findByUserName(username).orElse(null);
        if (u != null) {
            // Verificar que el nombre de usuario coincida exactamente (case-sensitive)
            if (!u.getUserName().equals(username)) {
                throw new UsernameNotFoundException("Usuario no encontrado: " + username);
            }
            return User.withUsername(u.getUserName())
                    .password(u.getPassword()) // BCrypt en BD
                    .authorities(List.of())    // ajusta roles si los manejas
                    .build();
        }

        // 2) Fallback local para "master" SOLO si no existe en BD
        if (masterUsername.equals(username)) {
            return User.withUsername(masterUsername)
                    .password(passwordEncoder.encode(masterPassword))
                    .roles("ADMIN")
                    .build();
        }

        throw new UsernameNotFoundException("Usuario no encontrado: " + username);
    }
}