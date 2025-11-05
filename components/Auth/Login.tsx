import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
const Login: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 id="login-title" className="text-lg font-semibold text-gray-800">
                Iniciar sesión
              </h2>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="text-gray-500 hover:text-gray-700"
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

            <form className="px-6 py-6" onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Ingresa tu correo"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <label className="inline-flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                  />
                  <span className="ml-2">Recuérdame</span>
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-orange-600 hover:underline"
                >
                  ¿Olvidaste la contraseña?
                </a>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                Entrar
              </button>
            </form>

            <div className="px-6 pb-6 pt-2 text-center text-sm text-gray-600">
              ¿No tienes cuenta?
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="ml-1 font-medium text-orange-600 hover:underline"
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