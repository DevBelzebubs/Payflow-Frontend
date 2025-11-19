"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Home,
  LayoutGrid,
  Package,
  History,
  Settings,
  LogOut,
  ShoppingCart,
  X,
  UserRoundPen
} from "lucide-react";
const navItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/services", label: "Servicios", icon: LayoutGrid },
  { href: "/dashboard/products", label: "Productos", icon: Package },
  { href: "/dashboard/history", label: "Historial", icon: History },
  { href: "/dashboard/config", label: "Configuración", icon: Settings },
  { href: "/dashboard/profile", label: "Perfil", icon: UserRoundPen },
];
interface SidebarProps {
  onOpenCart: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}
import { cn } from "@/lib/utils";
import useCart from "@/hooks/cart/useCart";
import { AnimatePresence, motion } from "framer-motion";
const Sidebar: React.FC<SidebarProps> = ({
  onOpenCart,
  mobileOpen,
  onMobileClose,
}) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="h-20 flex items-center justify-between px-6 border-b border-border flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            PayFlow
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          onClick={onMobileClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Cerrar menú</span>
        </Button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium",
                isActive
                  ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                  : "text-muted-foreground hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400"
              )}
              onClick={onMobileClose}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => {
            onOpenCart();
            onMobileClose();
          }}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium text-muted-foreground hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Mi Carrito</span>
          {itemCount > 0 && (
            <span className="ml-auto bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </nav>

      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-semibold">
            {user?.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {user?.nombre}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
  return (
    <>
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-card border-r border-border text-card-foreground flex-col h-screen sticky top-0">
        {SidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
            />

            <motion.aside
              className="fixed top-0 left-0 z-50 w-72 h-screen bg-card shadow-xl flex flex-col lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default Sidebar;
