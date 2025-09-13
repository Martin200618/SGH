package com.horarios.SGH.Service;

import com.horarios.SGH.Exception.BusinessException;
import com.horarios.SGH.Exception.ResourceNotFoundException;
import com.horarios.SGH.Model.users;
import com.horarios.SGH.Repository.Iusers;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class usersService {

    private final Iusers usersRepository;
    private final PasswordEncoder passwordEncoder;

    public usersService(Iusers usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<users> findById(int userId) {
        return usersRepository.findById(userId);
    }

    public String login(String userName, String password) {
        Optional<users> user = usersRepository.findByUserName(userName);

        if (!user.isPresent()) {
            throw new ResourceNotFoundException("Usuario", userName);
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            throw new BusinessException("Contraseña incorrecta");
        }

        return "Inicio de sesión exitoso";
    }
}