package com.horarios.SGH;

import org.springframework.context.annotation.Import;

@Import(TestSecurityConfig.class)
public abstract class BaseControllerTest {
    // Clase base para tests con configuración de seguridad que permite todo
}