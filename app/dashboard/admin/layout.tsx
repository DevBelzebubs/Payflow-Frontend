'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import { api } from '@/api/axiosConfig';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, loading, setUser } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (loading) return;

      if (!isAuthenticated) {
        router.push('/');
        return;
      }

      if (user?.rol === 'ADMIN' || user?.rol === 'admin') {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      try {
        const response = await api.get('/admin/verify');
        if (response.data.isAdmin) {
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedUser = { ...storedUser, rol: 'ADMIN', nivelAcceso: response.data.nivelAcceso };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          if (setUser) setUser(updatedUser);
          setAuthorized(true);
        } else {
          router.push('/dashboard');
        }
      } catch {
        router.push('/dashboard');
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [loading, isAuthenticated, user, router, setUser]);

  if (loading || checking) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
};

export default AdminLayout;
