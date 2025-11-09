'use client';
import React from 'react'
import Sidebar from './layout/Sidebar'
import { useAuth } from '@/hooks/auth/useAuth';

const Page = ({children,}:{children: React.ReactNode}) => {
  const { isAuthenticated, loading } = useAuth();
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return null;
}
