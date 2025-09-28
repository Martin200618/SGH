package com.horarios.SGH.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.horarios.SGH.IService.IUsersService;
import com.horarios.SGH.Model.users;
import com.horarios.SGH.Repository.Iusers;

@Service
public class usersService implements IUsersService {

    @Autowired
    private Iusers usersRepository;

    public Optional<users> findById(int userId) {
        try {
            return usersRepository.findById(userId);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener el usuario con ID: " + userId + ", Error: " + e.getMessage());
        }
    }

    public String login(String userName, String password) {
        if (userName == null || userName.trim().isEmpty()) {
            return "El nombre de usuario no puede estar vacío";
        }

        if (userName.contains(" ")) {
            return "El nombre de usuario no puede contener espacios";
        }

        // Validate that username doesn't contain uppercase letters
        if (!userName.equals(userName.toLowerCase())) {
            return "El nombre de usuario no puede contener letras mayúsculas";
        }
    
        // Validate that username doesn't contain numbers
        if (userName.matches(".*\\d.*")) {
            return "El nombre de usuario no puede contener números";
        }

        if (userName.length() > 100) {
            return "El nombre de usuario no puede exceder los 100 caracteres";
        }

        if (password == null || password.trim().isEmpty()) {
            return "La contraseña no puede estar vacía";
        }

        Optional<users> user = usersRepository.findByUserName(userName);

        if (!user.isPresent() || !user.get().getUserName().equals(userName)) {
            return "Usuario no encontrado";
        }

        if (!user.get().getPassword().equals(password)) {
            return "Contraseña incorrecta";
        }

        return "Inicio de sesión exitoso";
    }
}