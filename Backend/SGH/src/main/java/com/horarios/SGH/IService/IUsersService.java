package com.horarios.SGH.IService;

import com.horarios.SGH.Model.users;
import java.util.Optional;

public interface IUsersService {
    Optional<users> findById(int userId);
    String login(String userName, String password);
}