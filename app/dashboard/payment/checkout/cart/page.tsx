'use client'
import { getCuentaById, procesarPagoOrden } from '@/api/services/PaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/useAuth';
import useCart from '@/hooks/cart/useCart';
import { BankAccount } from '@/interfaces/BankAccounts/BankAccount';
import { cn } from '@/lib/utils';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const CartCheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cliente } = useAuth();
  const { cart, clearCart, itemCount } = useCart();

  const method = searchParams.get('method'); // 'MERCADOPAGO' | 'PAYFLOW'
  const accountId = searchParams.get('accountId');
  const [cuenta, setCuenta] = useState<BankAccount | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const totalCart = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

  useEffect(() => {
    if (itemCount === 0 && !success) {
      router.push('/dashboard/products');
      return;
    }

    const loadData = async () => {
      if (method !== 'MERCADOPAGO' && accountId) {
        try {
          const acc = await getCuentaById(accountId);
          setCuenta(acc);
        } catch (err) {
          setError("Error cargando datos de la cuenta");
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, [accountId, itemCount, router, success, method]);

  const handlePay = async () => {
    if (!cliente) return;
    
    if (method !== 'MERCADOPAGO' && cuenta && cuenta.saldo < totalCart) {
        return; 
    }

    setIsProcessing(true)
    try {
      const itemsOrden = cart.map(item => ({
        productoId: item.id,
        cantidad: item.quantity
      }));

      const payload: any = {
        clienteId: cliente.id,
        items: itemsOrden,
        datosPago: {
          origen: method === 'MERCADOPAGO' ? 'MERCADOPAGO' : (cuenta?.origen === 'BCP' ? 'BCP' : 'PAYFLOW'),
          monto: totalCart,
          cuentaId: cuenta?.id
        },
        notas: `Compra Web: ${itemCount} productos`
      };

      if(payload.datosPago.origen === 'BCP'){
         payload.datosPago.dniCliente = cliente.dni;
         payload.datosPago.numeroCuentaOrigen = cuenta?.numeroCuenta;
      }

      const response = await procesarPagoOrden(payload);

      if (response.urlPago) {
          window.location.href = response.urlPago;
          return;
      }

      setSuccess(true);
      clearCart();
      setTimeout(() => router.push('/dashboard/history'), 3000);

    } catch (err: any) {
      setError(err.message || 'Error en el pago');
      setIsProcessing(false);
    }
  }

  const currentBalance = cuenta?.saldo || 0;
  const newBalance = currentBalance - totalCart;
  const hasFunds = method === 'MERCADOPAGO' || newBalance >= 0;

  if (isLoading) return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
        <p className="ml-3 text-lg text-muted-foreground">Cargando...</p>
      </div>
  );

  if (success) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">¡Compra Exitosa!</h2>
          <p className="text-muted-foreground mt-2">Tu pedido ha sido generado. Redirigiendo...</p>
        </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-background min-h-screen">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 pl-0 text-muted-foreground hover:text-foreground hover:bg-accent">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a selección
      </Button>

      <Card className="shadow-xl overflow-hidden bg-card border border-border">
        <CardHeader className="bg-primary text-primary-foreground p-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-400 font-medium text-sm mb-1 uppercase tracking-wide">Confirmar Compra</p>
              <CardTitle className="text-3xl">Pago de Productos</CardTitle>
            </div>
            <ShieldCheck className="w-12 h-12 text-primary-foreground/70" />
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="bg-muted dark:bg-muted/50 rounded-xl p-6 mb-8 border border-border">
            
            {method === 'MERCADOPAGO' ? (
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                    Resumen de Pago (Mercado Pago)
                </h3>
            ) : (
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                    Balance de Cuenta ({cuenta?.banco} •••• {cuenta?.numeroCuenta.slice(-4)})
                </h3>
            )}

            <div className="space-y-3">
              {method !== 'MERCADOPAGO' && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Saldo Actual</span>
                    <span className="font-medium">S/ {currentBalance.toFixed(2)}</span>
                  </div>
              )}
              
              <div className="flex justify-between text-destructive">
                <span>Total Carrito ({itemCount} items)</span>
                <span className="font-bold text-xl">S/ {totalCart.toFixed(2)}</span>
              </div>

              {method !== 'MERCADOPAGO' && (
                  <>
                    <div className="h-px bg-border my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground text-lg">Nuevo Saldo</span>
                        <span className={cn("text-2xl font-bold", hasFunds ? "text-green-600 dark:text-green-400" : "text-destructive")}>
                        S/ {newBalance.toFixed(2)}
                        </span>
                    </div>
                  </>
              )}
            </div>
          </div>

          {!hasFunds && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Saldo insuficiente para completar la compra.
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 text-center text-sm">
              {error}
            </div>
          )}

          <Button
            className="w-full py-8 text-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg text-white"
            disabled={!hasFunds || isProcessing}
            onClick={handlePay}
          >
            {isProcessing ? (
              <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Procesando...</>
            ) : (
              method === 'MERCADOPAGO' 
                ? `Pagar con Mercado Pago`
                : `Confirmar Pago S/ ${totalCart.toFixed(2)}`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default CartCheckoutPage;