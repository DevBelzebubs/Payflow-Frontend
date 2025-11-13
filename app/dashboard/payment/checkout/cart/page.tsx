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

    const accountId = searchParams.get('accountId');
    const [cuenta, setCuenta] = useState<BankAccount | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const totalCart = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
    useEffect(() => {
        if (!accountId) return;
        if (itemCount === 0 && !success) {
            router.push('/dashboard/products');
            return;
        }
        const loadData = async () => {
            try {
                const acc = await getCuentaById(accountId);
                setCuenta(acc);
            } catch (err) {
                setError("Error cargando datos de la cuenta");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [accountId, itemCount, router, success]);
    const handlePay = async () => {
        if (!cliente || !cuenta || cart.length === 0) return;
        setIsProcessing(true)
        try {
            const itemsOrden = cart.map(item => ({
                productoId: item.id,
                cantidad: item.quantity
            }));
            await procesarPagoOrden({
                clienteId: cliente.id,
                items: itemsOrden,
                datosPago: {
                    origen: 'PAYFLOW',
                    cuentaId: cuenta.id,
                    monto: totalCart
                },
                notas: `Compra Web: ${itemCount} productos`
            });
            setSuccess(true);
            clearCart();
            setTimeout(() => router.push('/dashboard/historial'), 3000);
        } catch (err: any) {
            setError(err.message || 'Error en el pago');
            setIsProcessing(false);
        }
        if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-orange-500 w-8 h-8" /></div>;
        if (success) {
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">¡Compra Exitosa!</h2>
                    <p className="text-gray-500 mt-2">Tu pedido ha sido generado. Redirigiendo...</p>
                </div>
            );
        }
    }
    const currentBalance = cuenta?.saldo || 0;
        const newBalance = currentBalance - totalCart;
        const hasFunds = newBalance >= 0;
    return (
    <div className="max-w-3xl mx-auto p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 pl-0 hover:bg-transparent">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a selección
      </Button>

      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gray-900 text-white p-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-400 font-medium text-sm mb-1 uppercase tracking-wide">Confirmar Compra</p>
              <CardTitle className="text-3xl">Pago de Productos</CardTitle>
            </div>
            <ShieldCheck className="w-12 h-12 text-gray-700" />
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              Balance de Cuenta ({cuenta?.banco} •••• {cuenta?.numeroCuenta.slice(-4)})
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Saldo Actual</span>
                <span className="font-medium">${currentBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>(-) Total Carrito ({itemCount} items)</span>
                <span className="font-bold">-${totalCart.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-lg">Nuevo Saldo</span>
                <span className={cn("text-2xl font-bold", hasFunds ? "text-green-600" : "text-red-600")}>
                  ${newBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {!hasFunds && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Saldo insuficiente para completar la compra.
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center text-sm">
              {error}
            </div>
          )}

          <Button 
            className="w-full py-8 text-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
            disabled={!hasFunds || isProcessing}
            onClick={handlePay}
          >
            {isProcessing ? (
              <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Procesando...</>
            ) : (
              `Pagar $${totalCart.toFixed(2)}`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default CartCheckoutPage;