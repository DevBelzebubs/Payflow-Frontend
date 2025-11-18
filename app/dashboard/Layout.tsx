'use client';
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import Sidebar from './components/layout/Sidebar';
import Cart from './components/cart/Cart';
import DashboardHeader from './components/layout/DashboardHeader';
import WelcomeModal from './components/layout/WelcomeModal';

const Page = ({children,}:{children: React.ReactNode}) => {
const { isAuthenticated, loading, showWelcomeModal, closeWelcomeModal } = useAuth();  
const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <div className="flex min-h-screen bg-background text-foreground">        
        <Sidebar 
          onOpenCart={() => setIsCartOpen(true)}
          mobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col">
          
          <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
          <WelcomeModal 
           isOpen={showWelcomeModal} 
           onClose={closeWelcomeModal} 
        />
        </div>
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    );
  }
  return null;
}
export default Page;