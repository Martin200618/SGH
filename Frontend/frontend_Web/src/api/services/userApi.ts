import axios from "axios";

const API_URL = "http://localhost:8085/auth"; // 👈 mismo que en tu controlador

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,   // 👈 debe llamarse igual que en LoginRequestDTO
      password
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error;
  }
};
