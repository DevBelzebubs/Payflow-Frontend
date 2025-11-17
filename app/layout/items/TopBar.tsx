import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import {
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
const TopBar: React.FC<TopBarProps> = ({ isScrolled, mobileMenuOpen, setMobileMenuOpen, openLogin, setOpenLogin, openRegister, setOpenRegister }) => {
  const [openDashboard, setOpenDashboard] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const toggleDashboard = () => {
    setOpenDashboard(prev => !prev);
  }
  const router = useRouter();
  const goDashboard = () => {
    router.push("/dashboard");
  }
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/90 backdrop-blur-lg shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              PayFlow
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Características
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Cómo Funciona
            </a>
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  onClick={goDashboard}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-400 text-gray-600 hover:bg-gray-100"
                  onClick={logout}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  onClick={() => setOpenLogin(true)}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setOpenRegister(true)}
                >
                  Comenzar Gratis
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <a
              href="#features"
              className="block text-gray-700 hover:text-orange-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Características
            </a>
            <a
              href="#how-it-works"
              className="block text-gray-700 hover:text-orange-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cómo Funciona
            </a>
            <a
              href="#testimonials"
              className="block text-gray-700 hover:text-orange-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonios
            </a>
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                  onClick={goDashboard}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-400 text-gray-600"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600"
                  onClick={() => {
                    setOpenLogin(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
                  onClick={() => {
                    setOpenRegister(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Comenzar Gratis
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
export default TopBar;