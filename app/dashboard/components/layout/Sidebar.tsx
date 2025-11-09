'use client'
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Home,
  LayoutGrid,
  Package,
  History,
  Settings,
  LogOut,
} from 'lucide-react';
const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/dashboard/servicios', label: 'Servicios', icon: LayoutGrid },
  { href: '/dashboard/productos', label: 'Productos', icon: Package },
  { href: '/dashboard/historial', label: 'Historial', icon: History },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
]
import { cn } from '@/lib/utils';
const Sidebar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="h-20 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            PayFlow
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium',
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
            {user?.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {user?.nombre}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-red-50 hover:text-red-600"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}
export default Sidebar;