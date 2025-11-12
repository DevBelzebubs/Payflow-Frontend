'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from '@/api/axiosConfig';
import { useRouter } from "next/navigation";
import { User } from "@/interfaces/User";
import { Cliente } from "@/interfaces/Cliente";
import { AuthService } from "@/api/services/AuthService";
import { AuthContextType } from "@/lib/props/Auth/Contexts/AuthContextType";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const loadAuth = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                const parsedUser = JSON.parse(user);
                setToken(token);
                setUser(parsedUser);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setIsAuthenticated(true);
                syncUser(parsedUser.id);
            }
            setLoading(false);
        };
        loadAuth();
    }, []);
    const syncUser = async (userId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (token && !api.defaults.headers.common['Authorization']) {
                 api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const data = await AuthService.getClienteByUsuarioId(userId);
            setCliente(data);

        } catch (error) {
            console.error("Error al sincronizar cliente:", error);
            setCliente(null);
        }
    };
    const login = async (email: string, pass: string) => {
        setLoading(true);
        try {
            const reponse = await AuthService.login(email, pass);
            const { token: newToken, user: loggedUser } = reponse;
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(loggedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            await syncUser(loggedUser.id);

            setToken(newToken);
            setUser(loggedUser);
            setIsAuthenticated(true);

            await syncUser(loggedUser.id);
            router.replace('/dashboard')
        } catch (error) {
            console.error('Error de login:', error);
            setLoading(false);
            throw new Error('Email o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    }
    const register = async (nombre: string, email: string, pass: string, telefono: string, dni: string) => {
        setLoading(true);
        try {
            const response = await AuthService.register(nombre, email, pass, telefono, dni);
            const { token: newToken, user: registeredUser } = response;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(registeredUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setToken(newToken);
            setUser(registeredUser);
            setIsAuthenticated(true);
            try {
                const nuevoCliente = await AuthService.createCliente(registeredUser.id); 
                setCliente(nuevoCliente);
            } catch (createError) {
                console.error("Usuario registrado, pero falló la creación del cliente:", createError);
            }
            
            router.replace('/dashboard')

        } catch (error: any) {
            console.error('Error de registro:', error);
            const errorMessage = error.response?.data?.error || 'Error al registrar la cuenta.';
            setLoading(false);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }
    const logout = () => {
        setUser(null);
        setToken(null);
        setCliente(null);
        setIsAuthenticated(false);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        router.replace('/');

    };
    return (
        <AuthContext.Provider
            value={{
                user,
                cliente,
                setCliente,
                token,
                isAuthenticated,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}