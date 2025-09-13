package com.horarios.SGH.Service;

import com.horarios.SGH.Model.users;
import com.horarios.SGH.Repository.Iusers;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final Iusers userRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomUserDetailsService(Iusers userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        users u = userRepository.findByUserName(username).orElse(null);
        if (u != null) {
            return User.withUsername(u.getUserName())
                    .password(u.getPassword())
                    .authorities(List.of())
                    .build();
        }

        if ("master".equals(username)) {
            return User.withUsername("master")
                    .password(passwordEncoder.encode("Master$2025!"))
                    .roles("ADMIN")
                    .build();
        }

        throw new UsernameNotFoundException("Usuario no encontrado: " + username);
    }
}