'use client'
import { getMisCuentas } from '@/api/services/PaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useCart from '@/hooks/cart/useCart';
import { BankAccount } from '@/interfaces/BankAccounts/BankAccount';
import { cn } from '@/lib/utils';
import { ArrowRight, Building2, CheckCircle2, Loader2, ShoppingBag, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const CartSelectionPage = () => {
    const router = useRouter();
    const { cart, itemCount } = useCart();
    const [cuentas, setCuentas] = useState<BankAccount[]>([]);
    const [selectedCuentaId, setSelectedCuentaId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
        if (selectedCuentaId) {
            router.push(`/dashboard/payment/checkout/cart?accountId=${selectedCuentaId}`);
        }
        if (isLoading) return <div className="flex justify-center h-96 items-center"><Loader2 className="animate-spin text-orange-500" /></div>;
    };
    return (
        <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Resumen de Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-fit border-l-4 border-l-blue-500 shadow-md">
          <CardHeader className="bg-gray-50 pb-4">
            <CardTitle className="text-lg text-gray-700 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
                Productos en Carrito ({itemCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-medium text-gray-900">{item.nombre}</p>
                            <p className="text-gray-500">{item.quantity} x ${item.precio.toFixed(2)}</p>
                        </div>
                        <span className="font-semibold">${(item.precio * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-gray-600 font-medium text-lg">Total a Pagar</span>
              <span className="text-3xl font-bold text-blue-600">${totalCart.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center text-gray-800">
            <Wallet className="w-5 h-5 mr-2 text-gray-500" /> ¿Con qué cuenta deseas pagar?
          </h2>
          
          <div className="space-y-3">
            {cuentas.map((cuenta) => (
              <div 
                key={cuenta.id}
                onClick={() => setSelectedCuentaId(cuenta.id)}
                className={cn(
                  "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between hover:shadow-md",
                  selectedCuentaId === cuenta.id 
                    ? "border-orange-500 bg-orange-50" 
                    : "border-gray-200 bg-white hover:border-orange-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", selectedCuentaId === cuenta.id ? "bg-orange-200 text-orange-700" : "bg-gray-100 text-gray-500")}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{cuenta.banco}</p>
                    <p className="text-sm text-gray-500">{cuenta.tipoCuenta} •••• {cuenta.numeroCuenta.slice(-4)}</p>
                  </div>
                </div>
                {selectedCuentaId === cuenta.id && <CheckCircle2 className="w-6 h-6 text-orange-600" />}
              </div>
            ))}
          </div>

          <Button 
            className="w-full py-6 text-lg bg-gray-900 hover:bg-black"
            disabled={!selectedCuentaId}
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