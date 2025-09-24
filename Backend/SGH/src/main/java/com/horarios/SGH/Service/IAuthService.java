package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.LoginRequestDTO;
import com.horarios.SGH.DTO.LoginResponseDTO;
import com.horarios.SGH.Model.users;

public interface IAuthService {
    String register(String username, String rawPassword);
    LoginResponseDTO login(LoginRequestDTO req);
    users getProfile();
    void updateUserName(String newName);
}