package com.horarios.SGH.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.horarios.SGH.Model.users;
import com.horarios.SGH.Repository.Iusers;

@Service
public class usersService {

    @Autowired
    private Iusers usersRepository;

    // Obtener usuario por ID
    public Optional<users> findById(int userId) {
        try {
            return usersRepository.findById(userId);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener el usuario con ID: " + userId + ", Error: " + e.getMessage());
        }
    }

    // Validar inicio de sesión
    public String login(String userName, String password) {
        Optional<users> user = usersRepository.findByUserName(userName);

        if (!user.isPresent()) {
            return "Usuario no encontrado";
        }

        if (!user.get().getPassword().equals(password)) {
            return "Contraseña incorrecta";
        }

        return "Inicio de sesión exitoso";
    }
}