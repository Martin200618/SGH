package com.horarios.SGH;

import com.horarios.SGH.Controller.usersController;
import com.horarios.SGH.Model.users;
import com.horarios.SGH.Repository.Iusers;
import com.horarios.SGH.Service.usersService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(usersController.class)
@Import(UsersTestSecurityConfig.class)
public class UsersControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private usersService usersService;

    @MockBean
    private Iusers usersRepository;

    @Test
    public void testGetUserByIdSuccess() throws Exception {
        users user = new users();
        user.setUserId(1);
        user.setUserName("testuser");

        when(usersService.findById(1)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userName").value("testuser"));
    }

    @Test
    public void testGetUserByIdNotFound() throws Exception {
        when(usersService.findById(1)).thenReturn(Optional.empty());

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Usuario no encontrado"));
    }

    @Test
    public void testLoginSuccess() throws Exception {
        users user = new users();
        user.setUserName("testuser");
        user.setPassword("password");

        when(usersRepository.findByUserName("testuser")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/users/login")
                .param("userName", "testuser")
                .param("password", "password"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OK"));
    }

    @Test
    public void testLoginInvalidUsername() throws Exception {
        mockMvc.perform(post("/users/login")
                .param("userName", "")
                .param("password", "password"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("El nombre de usuario no puede estar vacío"));
    }

    @Test
    public void testLoginUserNotFound() throws Exception {
        when(usersRepository.findByUserName("testuser")).thenReturn(Optional.empty());

        mockMvc.perform(post("/users/login")
                .param("userName", "testuser")
                .param("password", "password"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Usuario no encontrado"));
    }

    @Test
    public void testDeleteUserSuccess() throws Exception {
        users user = new users();
        user.setUserName("testuser");

        when(usersRepository.findByUserName("testuser")).thenReturn(Optional.of(user));

        mockMvc.perform(delete("/users/testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Usuario eliminado correctamente"));
    }

    @Test
    public void testDeleteMasterUser() throws Exception {
        mockMvc.perform(delete("/users/master"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("No se puede eliminar el usuario master"));
    }

    @Test
    public void testDeleteUserNotFound() throws Exception {
        when(usersRepository.findByUserName("testuser")).thenReturn(Optional.empty());

        mockMvc.perform(delete("/users/testuser"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Usuario no encontrado"));
    }
}