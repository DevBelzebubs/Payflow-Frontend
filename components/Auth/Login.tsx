import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { AuthService } from '@/api/services/AuthService';

const Login: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const { loading: authLoading } = useAuth();
  const loading = authLoading || localLoading;
  const router = useRouter();

  const handleUniversalLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!identifier || !password) {
      setError("Por favor ingresa tus credenciales (Correo/DNI y Contraseña).");
      return;
    }

    setError(null);
    setLocalLoading(true);

    try {
      const response = await AuthService.loginWithBcp(identifier, password);

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        console.log("Login exitoso. Redirigiendo...", response.user);
        
        window.location.href = '/dashboard'; 
      } else {
        throw new Error("Credenciales incorrectas o respuesta inválida.");
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || "Error al conectar con el servidor.";
      setError(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 id="login-title" className="text-lg font-semibold text-foreground">
                Iniciar sesión
              </h2>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="px-6 py-6" onSubmit={handleUniversalLogin}>
              <div className="mb-4">
                <label
                  htmlFor="login-identifier"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Correo electrónico o DNI
                </label>
                <input
                  id="login-identifier"
                  name="identifier"
                  type="text" 
                  autoComplete="username"
                  placeholder="ej. usuario@email.com o 87654321"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Contraseña / Clave Web
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <label className="inline-flex items-center text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-input text-orange-500 focus:ring-orange-400 bg-background"
                  />
                  <span className="ml-2">Recuérdame</span>
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-orange-600 hover:underline dark:text-orange-500"
                >
                  ¿Olvidaste la contraseña?
                </a>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center mb-4 bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Entrar'}
              </button>
            </form>

            <div className="relative my-2 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">O ingresa con tu banco</span>
              </div>
            </div>

            <div className='flex justify-center px-6 mb-6'>
              <Button
                type="button"
                onClick={() => handleUniversalLogin()}
                className="w-full bg-[#0033A0] hover:bg-[#002a80] text-white flex items-center justify-center gap-2 transition-colors"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                </svg>
                {loading ? 'Conectando...' : 'Ingresar con BCP'}
              </Button>
            </div>

            <div className="px-6 pb-6 pt-4 text-center text-sm text-muted-foreground border-t border-border">
              ¿No tienes cuenta?
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="ml-1 font-medium text-orange-600 hover:underline dark:text-orange-500"
              >
                Regístrate
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Login;