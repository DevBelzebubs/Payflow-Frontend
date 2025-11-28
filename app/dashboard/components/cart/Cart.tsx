import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useCart from '@/hooks/cart/useCart';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Package, ShoppingCart, Trash2, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

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

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: '85vh' }}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground leading-none">Mi Carrito</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'} seleccionados
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
              {itemCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Tu carrito está vacío</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[200px] mx-auto">
                      Parece que aún no has agregado nada. ¡Explora nuestro catálogo!
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => { onClose(); router.push('/dashboard/products'); }}
                    className="mt-4"
                  >
                    Ir a comprar
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="group flex gap-4 p-3 rounded-xl border border-border/50 hover:border-orange-500/30 hover:bg-muted/30 transition-colors bg-card"
                      >
                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/50">
                          {item.imagen_url ? (
                            <img
                              src={item.imagen_url}
                              alt={item.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-muted-foreground/40" />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-semibold text-foreground truncate text-sm">
                                {item.nombre}
                              </h4>
                              <p className="font-bold text-foreground text-sm">
                                ${(item.precio * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Precio unitario: ${item.precio.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="secondary" className="text-xs font-medium px-2 py-0.5 h-6">
                              Cant: {item.quantity}
                            </Badge>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 -mr-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                              <span className="text-xs">Eliminar</span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {itemCount > 0 && (
              <div className="p-6 border-t border-border bg-muted/20 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-base font-semibold text-foreground">Total a Pagar</span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="col-span-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                    title="Vaciar carrito"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    className="col-span-2 bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all"
                    onClick={handleCheckout}
                  >
                    Ir a Pagar
                    <ArrowRight className="w-4 h-4 ml-2" />
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