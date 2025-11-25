import { CheckCircle, X, Zap } from 'lucide-react';
import React from 'react'

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-border animate-in zoom-in-95 duration-200">
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-orange-700/50 rounded-full p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenido a PayFlow!</h2>
          <p className="text-orange-100">Tu monedero digital está listo</p>
        </div>

        <div className="p-8">
          <div className="flex items-start mb-6">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Monedero creado exitosamente</h3>
              <p className="text-sm text-muted-foreground">Tu cuenta está configurada y lista para usar</p>
            </div>
          </div>

          <div className="flex items-start mb-6">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Seguridad garantizada</h3>
              <p className="text-sm text-muted-foreground">Tus datos están protegidos con encriptación</p>
            </div>
          </div>

          <div className="flex items-start mb-8">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Listo para pagar</h3>
              <p className="text-sm text-muted-foreground">Comienza a usar todos nuestros servicios</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] shadow-md"
            >
              Comenzar
            </button>
            <button
              onClick={onClose}
              className="w-full border-2 border-orange-500 text-orange-600 dark:text-orange-400 dark:border-orange-400/50 font-semibold py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            >
              Ver detalles
            </button>
          </div>
        </div>

        <div className="bg-muted/50 border-t border-border px-8 py-4 text-center text-sm text-muted-foreground">
          <p>Puedes acceder a tu monedero en el panel de control</p>
        </div>
      </div>
    </div>
  );
}
export default WelcomeModal;