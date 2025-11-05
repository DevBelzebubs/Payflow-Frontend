import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import {
  Zap,
  Menu,
  X,
} from 'lucide-react';
const TopBar:React.FC<TopBarProps> = ({ isScrolled, mobileMenuOpen, setMobileMenuOpen, openLogin,setOpenLogin,openRegister,setOpenRegister })=> {
  return (
    <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
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
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Testimonios
              </a>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
                onClick={() => setOpenLogin(openLogin)}
              >
                Iniciar Sesión
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => setOpenRegister(openRegister)}
              >
                Comenzar Gratis
              </Button>
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
              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-600"
                onClick={() => setOpenLogin(openLogin)}
              >
                Iniciar Sesión
              </Button>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
              onClick={() => setOpenRegister(openRegister)}
              >
                Comenzar Gratis
              </Button>
            </div>
          </div>
        )}
      </nav>
  )
}
export default TopBar;