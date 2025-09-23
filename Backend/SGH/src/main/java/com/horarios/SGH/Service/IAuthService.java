package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.LoginRequestDTO;
import com.horarios.SGH.DTO.LoginResponseDTO;

public interface IAuthService {
    String register(String username, String rawPassword);
    LoginResponseDTO login(LoginRequestDTO req);
}