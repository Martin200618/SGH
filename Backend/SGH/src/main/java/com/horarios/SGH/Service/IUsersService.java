package com.horarios.SGH.Service;

import com.horarios.SGH.Model.users;
import java.util.Optional;

public interface IUsersService {
    Optional<users> findById(int userId);
    String login(String userName, String password);
}