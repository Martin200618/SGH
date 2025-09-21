const API_URL = "http://localhost:8085/auth"; // 👈 mismo que en tu controlador

export const login = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username, // 👈 debe llamarse igual que en LoginRequestDTO
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error en login:", error.message);
    throw error;
  }
};
