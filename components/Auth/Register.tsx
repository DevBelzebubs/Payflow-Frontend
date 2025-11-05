import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
const Register:React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) =>{
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 id="register-title" className="text-lg font-semibold text-gray-800">
                Crear cuenta
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

            <form className="px-6 py-6 grid gap-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="reg-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nombre completo
                </label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Número de teléfono
                </label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+51 9 1234 5678"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Crea una contraseña segura"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-1 w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                Registrarme
              </button>
            </form>

            <div className="px-6 pb-6 pt-2 text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="ml-1 font-medium text-orange-600 hover:underline"
              >
                Inicia sesión
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Register;