'use client';
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import Sidebar from './components/layout/Sidebar';
import Cart from './components/cart/Cart';

const Page = ({children,}:{children: React.ReactNode}) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-orange-600">Cargando...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onOpenCart={() => setIsCartOpen(true)}/>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    );
  }
  return null;
}
export default Page;