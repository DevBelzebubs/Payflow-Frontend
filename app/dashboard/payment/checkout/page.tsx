'use client'
import { getServicioById } from '@/api/services/CatalogService';
import { getCuentaById, procesarPagoOrden } from '@/api/services/PaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/useAuth';
import { BankAccount } from '@/interfaces/BankAccounts/BankAccount';
import { Servicio } from '@/interfaces/services/Service';
import { cn } from '@/lib/utils';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const CheckoutPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { cliente } = useAuth();

    const serviceId = searchParams.get('serviceId');
    const accountId = searchParams.get('accountId');

    const [servicio, setServicio] = useState<Servicio | null>(null);
    const [cuenta, setCuenta] = useState<BankAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const seatsParam = searchParams.get('seats');
    const seats = seatsParam ? JSON.parse(seatsParam) : [];
    useEffect(() => {
        if (!serviceId || !accountId) return;
        const loadData = async () => {
            try {
                const [srv, acc] = await Promise.all([getServicioById(serviceId), getCuentaById(accountId)]);
                setServicio(srv)
                setCuenta(acc);
            } catch (err) {
                setError("Error cargando datos del checkout");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [serviceId, accountId])
    const handlePay = async () => {
        if (!cliente?.id || !servicio || !cuenta) return;
        setIsProcessing(true);
        try {
            await procesarPagoOrden({
                clienteId: cliente.id,
                items: [{
                    servicioId: servicio.idServicio,
                    cantidad: seats.length || 1,
                    seats: seats
                }],
                datosPago: {
                    origen: 'PAYFLOW',
                    cuentaId: cuenta.id,
                    monto: servicio.recibo
                },
                notas: `Pago Web: ${servicio.nombre}`
            });
            setSuccess(true);
            setTimeout(() => router.push('/dashboard/history'), 3000);
        } catch (err: any) {
            setError(err.message || 'Error en el pago');
            setIsProcessing(false);
        };
    }
    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
        </div>
    );

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">¡Pago Confirmado!</h2>
                <p className="text-muted-foreground mt-2">Redirigiendo a tu historial...</p>
            </div>
        );
    }
    if (error && !isProcessing) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-destructive/10 border border-destructive/30 rounded-lg p-6">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="mt-4 text-xl font-semibold text-destructive">{error || 'Servicio no encontrado'}</p>
                <Button asChild variant="link" className="text-primary hover:text-primary/80 mt-2">
                    <Link href="/dashboard/services"><ArrowLeft className="w-4 h-4 mr-2" />Volver a Servicios</Link>
                </Button>
            </div>
        );
    }

    const currentBalance = cuenta?.saldo || 0;
    const cost = servicio?.recibo || 0;
    const newBalance = currentBalance - cost;
    const hasFunds = newBalance >= 0;
    return (
        <div className="max-w-3xl mx-auto p-6 bg-background min-h-screen">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 pl-0 text-muted-foreground hover:text-foreground hover:bg-accent">
                <ArrowLeft className="w-4 h-4 mr-2" /> Volver a selección
            </Button>

            <Card className="shadow-xl overflow-hidden bg-card border border-border">
                <CardHeader className="bg-gray-900 text-white p-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-orange-400 font-medium text-sm mb-1 uppercase tracking-wide">Confirmar Transacción</p>
                            <CardTitle className="text-3xl">{servicio?.nombre}</CardTitle>
                        </div>
                        <ShieldCheck className="w-12 h-12 text-primary-foreground/70" />
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    <div className="bg-muted dark:bg-muted/50 rounded-xl p-6 mb-8 border border-border">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center">
                            Detalle de Saldos ({cuenta?.banco} •••• {cuenta?.numeroCuenta.slice(-4)})
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Saldo Actual</span>
                                <span className="font-medium">S/ {currentBalance.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-destructive">
                                <span>(-) Costo del Servicio</span>
                                <span className="font-bold">-S/ {cost.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-border my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-foreground text-lg">Nuevo Saldo</span>
                                <span className={cn("text-2xl font-bold", hasFunds ? "text-green-600 dark:text-green-400" : "text-destructive")}>
                                    S/ {newBalance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {!hasFunds && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Saldo insuficiente para realizar esta operación.
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
                            "Confirmar Pago"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
export default CheckoutPage;