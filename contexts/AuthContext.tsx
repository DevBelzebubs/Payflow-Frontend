'use client';

import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/interfaces/User";
import { Cliente } from "@/interfaces/Cliente";
import { AuthService } from "@/api/services/AuthService";
import { updateUserProfile } from "@/api/services/UserService";
import { AuthContextType } from "@/lib/props/auth/Contexts/AuthContextType";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setSessionCookie(token: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `payflow_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function removeSessionCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'payflow_token=; path=/; max-age=0; SameSite=Lax';
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { getSession, saveSession, clearSession, setAuthHeader } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      const loggedUser = session.user as User;
      setToken(session.token);
      setUser(loggedUser);
      setAuthHeader(session.token);
      setIsAuthenticated(true);
      setSessionCookie(session.token);
      if (loggedUser.rol === 'DEMO') {
        setCliente({
          id: 'demo-cliente-0000',
          usuarioId: 'demo-user-0000',
          nombre: 'Usuario Demo',
          correo: 'demo@payflow.com',
          telefono: '',
          dni: '00000000',
          fechaRegistro: new Date().toISOString(),
        });
      } else {
        syncUser(loggedUser.id);
      }
    }
    setLoading(false);
  }, []);

  const syncUser = useCallback(async (userId: string) => {
    try {
      const data = await AuthService.getClienteByUsuarioId(userId);
      setCliente(data);
    } catch (error) {
      console.error("Error al sincronizar cliente:", error);
      setCliente(null);
    }
  }, []);

  const handleAuthSuccess = useCallback(async (newToken: string, loggedUser: User, isNewUser: boolean) => {
    saveSession(newToken, loggedUser);
    setSessionCookie(newToken);
    setToken(newToken);
    setUser(loggedUser);
    setIsAuthenticated(true);

    if (isNewUser) {
      setShowWelcomeModal(true);
    }

    await syncUser(loggedUser.id);
    router.replace('/dashboard');
  }, [saveSession, syncUser, router]);

  const login = useCallback(async (email: string, pass: string) => {
    setLoading(true);
    try {
      const response = await AuthService.login(email, pass);
      const { token: newToken, user: loggedUser, isNewUser } = response as any;
      await handleAuthSuccess(newToken, loggedUser, isNewUser);
    } catch (error) {
      console.error('Error de login:', error);
      setLoading(false);
      throw new Error('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }, [handleAuthSuccess]);

  const register = useCallback(async (nombre: string, email: string, pass: string, telefono: string, dni: string) => {
    setLoading(true);
    try {
      const response = await AuthService.register(nombre, email, pass, telefono, dni);
      const { token: newToken, user: registeredUser } = response;
      saveSession(newToken, registeredUser);
      setSessionCookie(newToken);
      setToken(newToken);
      setUser(registeredUser);
      setIsAuthenticated(true);

      try {
        const nuevoCliente = await AuthService.createCliente(registeredUser.id);
        setCliente(nuevoCliente);
      } catch (createError) {
        console.error("Usuario registrado, pero falló la creación del cliente:", createError);
      }

      setShowWelcomeModal(true);
      router.replace('/dashboard');
    } catch (error: any) {
      console.error('Error de registro:', error);
      const errorMessage = error.response?.data?.error || 'Error al registrar la cuenta.';
      setLoading(false);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [saveSession, router]);

  const loginWithBcp = useCallback(async (dni: string, password: string) => {
    setLoading(true);
    try {
      const response = await AuthService.loginWithBcp(dni, password);
      const { token: newToken, user: loggedUser, isNewUser } = response as any;
      await handleAuthSuccess(newToken, loggedUser, isNewUser);
    } catch (error: any) {
      console.error('Error login BCP:', error);
      setLoading(false);
      throw new Error(error.response?.data?.error || error.message || 'Credenciales BCP inválidas');
    } finally {
      setLoading(false);
    }
  }, [handleAuthSuccess]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setCliente(null);
    setIsAuthenticated(false);
    clearSession();
    removeSessionCookie();
    router.replace('/');
  }, [clearSession, router]);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("Usuario no autenticado");
    setLoading(true);
    try {
      await AuthService.login(user.email, currentPassword);
      const updateData = { password: newPassword, usuarioId: user.id };
      const updateUser = await updateUserProfile(updateData as any);
      setUser(updateUser);
      localStorage.setItem('user', JSON.stringify(updateUser));
    } catch (error: any) {
      if (error.message === 'Email o contraseña incorrectos.' || error.response?.status === 401) {
        throw new Error('La contraseña actual es incorrecta.');
      }
      throw new Error(error.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        cliente,
        setCliente,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        showWelcomeModal,
        closeWelcomeModal: () => setShowWelcomeModal(false),
        updatePassword,
        syncUser,
        loginWithBcp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
