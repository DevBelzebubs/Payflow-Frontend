import { Button } from '@/components/ui/button';
import useCart from '@/hooks/cart/useCart';
import { Producto } from '@/interfaces/services/Products';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Package, ShoppingCart, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react'

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, clearCart, itemCount } = useCart();
    const router = useRouter();
    const handleCheckout = () => {
        onClose();
        router.push('/dashboard/payment/selection/cart');
    };
    const total = cart.reduce((acc, item) => {
        return acc + item.precio * item.quantity;
    }, 0);
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <motion.div
                        className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col"
                        style={{ height: 'calc(100vh - 80px)', maxHeight: '700px' }}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 id="cart-title" className="text-lg font-semibold text-gray-800 flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-2 text-orange-500" />
                                Mi Carrito ({itemCount})
                            </h2>
                            <button onClick={onClose} aria-label="Cerrar" className="text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {itemCount === 0 ? (
                                <div className="text-center text-gray-500 py-10">
                                    <p>Tu carrito está vacío.</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            {item.imagen_url ? (
                                                <img
                                                    src={item.imagen_url}
                                                    alt={item.nombre}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 truncate">{item.nombre}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} x ${item.precio.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ${(item.precio * item.quantity).toFixed(2)}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-auto p-1"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                Quitar
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {itemCount > 0 && (
                            <div className="px-6 py-4 border-t space-y-4">
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" className="w-full" onClick={clearCart}>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Vaciar Carrito
                                    </Button>
                                    
                                    <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleCheckout}>
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Proceder al Pago
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
export default Cart;