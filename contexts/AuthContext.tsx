'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from '@/api/axiosConfig';
import { useRouter } from "next/navigation";
import { User } from "@/interfaces/User";
import { AuthContextType } from "@/lib/props/Auth/Contexts/AuthContextType";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter()
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            const parsedUser = JSON.parse(user);
            setToken(token);
            setUser(parsedUser);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, [])
    const login = async (email: string, pass: string) => {
        setLoading(true);
        try {
            const reponse = await api.post('/auth/login', {
                email: email,
                password: pass,
            });
            const { token: newToken, user: loggedUser } = reponse.data;
            setToken(newToken);
            setUser(loggedUser);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(loggedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            router.replace('/dashboard')
        } catch (error) {
            console.error('Error de login:', error);
            throw new Error('Email o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    }
    const register = async (nombre: string, email: string, pass: string, telefono: string, dni: string) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/register', {
                nombre: nombre,
                email: email,
                password: pass,
                telefono: telefono,
                dni: dni
            });
            const {token: newToken, user: registeredUser} = response.data;
            setToken(newToken);
            setUser(registeredUser);

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(registeredUser));

            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            router.replace('/dashboard')

        } catch (error: any) {
            console.error('Error de registro:', error);
            const errorMessage = error.response?.data?.error || 'Error al registrar la cuenta.';
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        router.replace('/');

    };
    const isAuthenticated = !!token;
    return (
        <AuthContext.Provider
            value={{
                user,
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