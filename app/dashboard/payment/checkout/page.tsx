'use client'
import { getServicioById } from '@/api/services/CatalogService';
import { getCuentaById, procesarPagoOrden } from '@/api/services/PaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/useAuth';
import { BankAccount } from '@/interfaces/BankAccounts/BankAccount';
import { Servicio } from '@/interfaces/services/Service';
import { cn } from '@/lib/utils';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, ShieldCheck, Ticket, Armchair } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { api } from '@/api/axiosConfig';

// Definimos la interfaz localmente para no depender de la exportación del otro componente si no es necesario,
// o podrías importarla si la exportaste.
interface TicketType {
  id: string;
  nombre: string;
  precio: number;
}

const CheckoutPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { cliente } = useAuth();

    const serviceId = searchParams.get('serviceId');
    const accountId = searchParams.get('accountId');
    const method = searchParams.get('method'); // 'MERCADOPAGO' o 'PAYFLOW'
    
    // Parámetros opcionales según el tipo de servicio
    const seatsParam = searchParams.get('seats');
    const ticketTypeId = searchParams.get('ticketTypeId');

    const seats = seatsParam ? JSON.parse(seatsParam) : [];

    const [servicio, setServicio] = useState<Servicio | null>(null);
    const [cuenta, setCuenta] = useState<BankAccount | null>(null);
    const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!serviceId) return;
        
        const loadData = async () => {
            try {
                // 1. Cargar Servicio
                const srv = await getServicioById(serviceId);
                setServicio(srv);

                // 2. Cargar Cuenta (si se seleccionó una, para Mercado Pago puede ser null)
                if (accountId) {
                    const acc = await getCuentaById(accountId);
                    setCuenta(acc);
                }

                // 3. Si es EVENTO y hay ticketTypeId, cargar el precio específico
                if (srv.tipo_servicio === 'EVENTO' && ticketTypeId) {
                    try {
                        const typesRes = await api.get<TicketType[]>(`/servicios/${serviceId}/tipos-entrada`);
                        const type = typesRes.data.find(t => t.id === ticketTypeId);
                        if (type) setSelectedTicketType(type);
                    } catch (e) {
                        console.warn("No se pudo cargar el tipo de entrada");
                    }
                }

            } catch (err) {
                setError("Error cargando datos del checkout");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [serviceId, accountId, ticketTypeId]);

    // --- CÁLCULO DEL TOTAL ---
    const calculateTotal = () => {
        if (!servicio) return 0;
        
        // A. Cine: Precio base * cantidad de butacas
        if (servicio.tipo_servicio === 'CINE') {
            return (seats.length || 1) * servicio.recibo;
        }

        // B. Evento: Precio del tipo de entrada
        if (servicio.tipo_servicio === 'EVENTO' && selectedTicketType) {
            return selectedTicketType.precio;
        }

        // C. Otros: Precio base
        return servicio.recibo;
    };

    const totalAmount = calculateTotal();

    const handlePay = async () => {
        // 1. Validación de Seguridad: Datos del Cliente
        if (!cliente || !cliente.id) {
            setError("Error de sesión: No se pudo identificar al cliente. Por favor recarga la página.");
            return;
        }
        if (!servicio) return;
        
        // Validación de saldo solo si es pago con cuenta interna (NO Mercado Pago)
        if (method !== 'MERCADOPAGO' && cuenta) {
             if (cuenta.saldo < totalAmount) {
                 setError("Saldo insuficiente en la cuenta seleccionada.");
                 return;
             }
        }

        setIsProcessing(true);
        try {
            const payload: any = {
                clienteId: cliente.id, // Ahora estamos seguros que existe
                items: [{ 
                    servicioId: servicio.idServicio, 
                    cantidad: (servicio.tipo_servicio === 'CINE' ? seats.length : 1),
                    seats: seats.length > 0 ? seats : undefined,
                    ticketTypeId: ticketTypeId || undefined 
                }],
                datosPago: {
                    origen: method === 'MERCADOPAGO' ? 'MERCADOPAGO' : (cuenta?.origen === 'BCP' ? 'BCP' : 'PAYFLOW'),
                    monto: totalAmount,
                    cuentaId: cuenta?.id
                },
                notas: `Pago Web: ${servicio.nombre}`
            };
            
            // Si es BCP, inyectamos datos requeridos
            if (payload.datosPago.origen === 'BCP') {
                 // Usamos el DNI del cliente cargado en sesión
                 payload.datosPago.dniCliente = cliente.dni; 
                 payload.datosPago.numeroCuentaOrigen = cuenta?.numeroCuenta; 
                 
                 if (!payload.datosPago.dniCliente) {
                    throw new Error("Tu usuario no tiene un DNI registrado. Actualiza tu perfil.");
                 }
            }

            const response = await procesarPagoOrden(payload);

            // Redirección Mercado Pago
            if (response.urlPago) {
                window.location.href = response.urlPago;
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push('/dashboard/history'), 3000);

        } catch (err: any) {
            console.error("Error checkout:", err);
            setError(err.message || 'Error al procesar el pago');
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
                <p className="mt-4 text-xl font-semibold text-destructive">{error}</p>
                <Button asChild variant="link" className="text-primary hover:text-primary/80 mt-2">
                    <Link href="/dashboard/services"><ArrowLeft className="w-4 h-4 mr-2" />Volver a Servicios</Link>
                </Button>
            </div>
        );
    }

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
                            {selectedTicketType && (
                                <p className="text-gray-300 mt-1 text-sm">Entrada: {selectedTicketType.nombre}</p>
                            )}
                        </div>
                        <ShieldCheck className="w-12 h-12 text-primary-foreground/70" />
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    
                    {/* DETALLE DE BUTACAS (Si existen) */}
                    {seats.length > 0 && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg flex items-start gap-3">
                            <Armchair className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-blue-900 dark:text-blue-100">Butacas Seleccionadas</p>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    {seats.map((s:any) => `${s.row}${s.col}`).join(', ')}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-muted dark:bg-muted/50 rounded-xl p-6 mb-8 border border-border">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center">
                            Detalle del Pago
                        </h3>

                        <div className="space-y-3">
                            {cuenta && (
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Saldo Actual ({cuenta.banco})</span>
                                    <span className="font-medium">S/ {cuenta.saldo.toFixed(2)}</span>
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                                <span className="text-foreground">Costo del Servicio</span>
                                <span className="font-bold text-xl text-orange-600">-S/ {totalAmount.toFixed(2)}</span>
                            </div>

                            {cuenta && (
                                <>
                                    <div className="h-px bg-border my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-foreground">Nuevo Saldo Estimado</span>
                                        <span className={cn("text-lg font-bold", (cuenta.saldo - totalAmount) >= 0 ? "text-green-600" : "text-destructive")}>
                                            S/ {(cuenta.saldo - totalAmount).toFixed(2)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <Button
                        className="w-full py-8 text-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg text-white"
                        disabled={isProcessing || (cuenta ? cuenta.saldo < totalAmount : false)}
                        onClick={handlePay}
                    >
                        {isProcessing ? (
                            <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Procesando...</>
                        ) : (
                            method === 'MERCADOPAGO' ? "Pagar con Mercado Pago" : "Confirmar Pago"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
export default CheckoutPage;