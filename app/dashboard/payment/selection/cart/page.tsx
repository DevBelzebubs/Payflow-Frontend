'use client'
import { getMisCuentas } from '@/api/services/PaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useCart from '@/hooks/cart/useCart';
import { BankAccount } from '@/interfaces/BankAccounts/BankAccount';
import { cn } from '@/lib/utils';
import { ArrowRight, Building2, CheckCircle2, CreditCard, Loader2, ShoppingBag, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const CartSelectionPage = () => {
  const router = useRouter();
  const { cart, itemCount } = useCart();
  const [cuentas, setCuentas] = useState<BankAccount[]>([]);
  const [selectedCuentaId, setSelectedCuentaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para el método de pago
  const [paymentMethod, setPaymentMethod] = useState<'ACCOUNT' | 'MERCADOPAGO' | null>(null);

  const totalCart = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

  useEffect(() => {
    if (itemCount === 0) {
      router.push('/dashboard/products');
      return;
    }
    const loadCuentas = async () => {
      try {
        const data = await getMisCuentas();
        setCuentas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      };
    };
    loadCuentas();
  }, [itemCount, router]);

  const handleContinue = () => {
    // Validaciones básicas
    if (!paymentMethod) return;
    if (paymentMethod === 'ACCOUNT' && !selectedCuentaId) return;

    // Construcción de parámetros
    const params = new URLSearchParams();
    
    if (paymentMethod === 'MERCADOPAGO') {
        params.set('method', 'MERCADOPAGO');
    } else {
        params.set('method', 'PAYFLOW');
        if (selectedCuentaId) params.set('accountId', selectedCuentaId);
    }

    router.push(`/dashboard/payment/checkout/cart?${params.toString()}`);
  };

  if (isLoading) return <div className="flex justify-center h-96 items-center"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-foreground mb-8">Resumen de Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-fit border-l-4 border-l-orange-500 shadow-md bg-card">
          <CardHeader className="bg-muted dark:bg-muted/50 pb-4 rounded-t-lg">
            <CardTitle className="text-lg text-foreground flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
              Productos en Carrito ({itemCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-foreground">{item.nombre}</p>
                    <p className="text-muted-foreground">{item.quantity} x ${item.precio.toFixed(2)}</p>
                  </div>
                  <span className="font-semibold text-foreground">${(item.precio * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
              <span className="text-muted-foreground font-medium text-lg">Total a Pagar</span>
              <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">${totalCart.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center text-foreground">
            <Wallet className="w-5 h-5 mr-2 text-muted-foreground" /> ¿Cómo deseas pagar?
          </h2>

          <div className="space-y-3">
            <div 
              onClick={() => { setPaymentMethod('MERCADOPAGO'); setSelectedCuentaId(null); }}
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4",
                paymentMethod === 'MERCADOPAGO'
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                  : "border-border bg-card hover:border-blue-200"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-foreground">Mercado Pago</p>
                <p className="text-xs text-muted-foreground">Tarjetas, Yape, Efectivo</p>
              </div>
              {paymentMethod === 'MERCADOPAGO' && <CheckCircle2 className="w-6 h-6 text-blue-600 ml-auto" />}
            </div>

            {cuentas.map((cuenta) => (
              <div
                key={cuenta.id}
                onClick={() => { setPaymentMethod('ACCOUNT'); setSelectedCuentaId(cuenta.id); }}
                className={cn(
                  "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between hover:shadow-md",
                  selectedCuentaId === cuenta.id && paymentMethod === 'ACCOUNT'
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-border bg-card hover:border-orange-200 dark:hover:border-orange-800/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center",
                    selectedCuentaId === cuenta.id && paymentMethod === 'ACCOUNT'
                      ? "bg-orange-200 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
                      : "bg-muted text-muted-foreground"
                  )}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{cuenta.banco}</p>
                    <p className="text-sm text-muted-foreground">{cuenta.tipoCuenta} •••• {cuenta.numeroCuenta.slice(-4)}</p>
                  </div>
                </div>
                {selectedCuentaId === cuenta.id && paymentMethod === 'ACCOUNT' && <CheckCircle2 className="w-6 h-6 text-orange-600" />}
              </div>
            ))}
          </div>

          <Button
            className="w-full py-6 text-lg bg-foreground text-background hover:bg-foreground/90"
            disabled={!paymentMethod || (paymentMethod === 'ACCOUNT' && !selectedCuentaId)}
            onClick={handleContinue}
          >
            Continuar al Checkout <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
export default CartSelectionPage;