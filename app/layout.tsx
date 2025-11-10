import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PayFlow - Pagos Fluidos para tu Negocio',
  description: 'La plataforma de pagos más rápida y segura. Acepta pagos globales con la mejor experiencia para tus clientes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>  
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
