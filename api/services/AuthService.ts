import { User } from "@/interfaces/User";
import { api } from "../axiosConfig";
import { Cliente } from "@/interfaces/Cliente";

interface AuthResponse {
  user: User;
  token: string;
}
const login = async (email: string, pass: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", {
      email: email,
      password: pass,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error en el servicio de login:",
      error.response?.data?.error || error.message
    );
    throw new Error(error.response?.data?.error || "Error al iniciar sesión");
  }
};

const register = async (
  nombre: string,
  email: string,
  pass: string,
  telefono: string,
  dni: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/register", {
      nombre: nombre,
      email: email,
      password: pass,
      telefono: telefono,
      dni: dni,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error en el servicio de registro:",
      error.response?.data?.error || error.message
    );
    throw new Error(error.response?.data?.error || "Error al registrarse");
  }
};

const getClienteByUsuarioId = async (usuarioId: string): Promise<Cliente> => {
  try {
    const response = await api.get<Cliente>(`/clientes/usuario/${usuarioId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error al obtener el cliente:",
      error.response?.data?.error || error.message
    );
    const errorMsg =
      error.response?.data?.error || "No se pudo cargar el perfil del cliente";
    throw new Error(errorMsg);
  }
};

const createCliente = async (usuario_id: string): Promise<Cliente> => {
  try {
    const response = await api.post<Cliente>(
      "/clientes",
      {
        usuario_id: usuario_id,
      },
      {}
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error al crear el cliente:",
      error.response?.data?.error || error.message
    );
    const errorMsg =
      error.response?.data?.error || "No se pudo crear el perfil del cliente";
    throw new Error(errorMsg);
  }
};
export const AuthService = {
  login,
  register,
  getClienteByUsuarioId,
  createCliente,
};
