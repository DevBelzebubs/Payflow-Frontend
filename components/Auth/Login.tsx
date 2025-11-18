import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
const Login: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, loading } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    }
  }
  const handleBcpLogin = async () => {
    setError(null);
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión con BCP");
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form className="px-6 py-6" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Ingresa tu correo"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Contraseña
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
                <p className="text-sm text-destructive text-center mb-4">{error}</p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors"
              >
                {loading ? 'Cargando...' : 'Entrar'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">O ingresa con tu banco</span>
              </div>
            </div>

            <div className='flex justify-center px-6'>
              <Button
                type="button"
                onClick={handleBcpLogin}
                className="w-full bg-[#0033A0] hover:bg-[#002a80] text-white flex items-center justify-center gap-2"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                </svg>
                Ingresar con BCP
              </Button>
            </div>

            <div className="px-6 pb-6 pt-4 text-center text-sm text-muted-foreground">
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