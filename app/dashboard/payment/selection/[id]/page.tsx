'use client'
import { getServicioById } from '@/api/services/CatalogService';
import { getMisCuentas } from '@/api/services/PaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BankAccount } from '@/interfaces/BankAccounts/BankAccount';
import { Servicio } from '@/interfaces/services/Service';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Loader2, Ticket, Wallet } from 'lucide-react';
import { api } from '@/api/axiosConfig';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { SeatSelector } from '@/app/dashboard/components/layout/SeatSelector';
import { TicketType, TicketTypeSelector } from '@/app/dashboard/components/layout/TicketTypeSelector';

const PaymentSelectionPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [cuentas, setCuentas] = useState<BankAccount[]>([]);
  const [selectedCuentaId, setSelectedCuentaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [occupiedSeats, setOccupiedSeats] = useState<{ row: string; col: number }[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<{ row: string; col: number }[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | null>(null);
  useEffect(() => {
    const init = async () => {
      try {
        const [srv, accs] = await Promise.all([getServicioById(id), getMisCuentas()]);
        setServicio(srv);
        setCuentas(accs);

        if (srv.tipo_servicio === 'CINE') {
          try {
            const seats = await api.get(`/servicios/${id}/butacas`);
            setOccupiedSeats(seats.data || []);
          } catch (error) {
            console.warn("No se pudieron cargar las butacas.");
            setOccupiedSeats([]);
          }
        } 
        else if (srv.tipo_servicio === 'EVENTO') {
           try {
             const typesRes = await api.get(`/servicios/${id}/tipos-entrada`);
             setTicketTypes(typesRes.data || []);
           } catch (error) {
             console.warn("No se pudieron cargar los tipos de entrada.");
           }
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [id]);
  const calculateTotal = () => {
    if (!servicio) return 0;
    if (servicio.tipo_servicio === 'CINE') {
        return selectedSeats.length > 0 ? selectedSeats.length * servicio.recibo : 0;
    }
    return servicio.recibo;
  };
  const handleContinue = () => {
    if (!servicio || !selectedCuentaId) return;
    if (servicio.tipo_servicio === 'CINE' && selectedSeats.length === 0) {
        alert("Por favor selecciona al menos una butaca para continuar.");
        return;
    }
    const queryParams = new URLSearchParams();
    queryParams.set('serviceId', servicio.idServicio);
    queryParams.set('accountId', selectedCuentaId);
    if (servicio.tipo_servicio === 'CINE') {
        queryParams.set('seats', JSON.stringify(selectedSeats));
    }
    router.push(`/dashboard/payment/checkout?${queryParams.toString()}`);
  };
  if (isLoading) return (
    <div className="flex justify-center h-96 items-center">
      <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
    </div>
  );

  if (!servicio) return (
    <div className="flex justify-center h-96 items-center">
      <p className="text-muted-foreground">Servicio no encontrado</p>
    </div>
  );
  const totalPagar = calculateTotal();
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-background animate-in fade-in slide-in-from-bottom-4">
      <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0 mb-4">
        <Link href={`/dashboard/services/${servicio.idServicio}`}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a detalles de {servicio.nombre}
        </Link>
      </Button>
      
      <h1 className="text-3xl font-bold text-foreground mb-8">Configura tu Pago</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-6">
            <Card className="h-fit border-l-4 border-l-orange-500 shadow-md bg-card">
            <CardHeader className="bg-muted pb-4 dark:bg-muted/50 rounded-t-lg">
                <CardTitle className="text-lg text-foreground">Resumen del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div>
                <p className="text-sm text-muted-foreground">Servicio</p>
                <p className="text-xl font-semibold text-foreground">{servicio?.nombre}</p>
                </div>
                <div>
                <p className="text-sm text-muted-foreground">Proveedor</p>
                <p className="font-medium text-foreground">{servicio?.proveedor || 'PayFlow'}</p>
                </div>
                
                <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="text-muted-foreground font-medium">
                    Total a Pagar 
                    {servicio.tipo_servicio === 'CINE' && selectedSeats.length > 0 && (
                        <span className="text-xs ml-2 font-normal">({selectedSeats.length} butacas x S/ {servicio.recibo})</span>
                    )}
                </span>
                <span className="text-3xl font-bold text-orange-600">S/ {totalPagar.toFixed(2)}</span>
                </div>
            </CardContent>
            </Card>

            {servicio.tipo_servicio === 'CINE' && (
                <Card className="border-2 border-dashed border-orange-200 dark:border-orange-900/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <Ticket className="w-5 h-5 mr-2 text-orange-500" />
                            Selecciona tus asientos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SeatSelector 
                            occupiedSeats={occupiedSeats}
                            onSelectionChange={setSelectedSeats}
                            price={servicio.recibo}
                        />
                    </CardContent>
                </Card>
            )}
            {servicio.tipo_servicio === 'EVENTO' && (
                <Card className="border-2 border-dashed border-blue-200 dark:border-blue-900/50">
                    <CardHeader className="bg-blue-50 dark:bg-blue-900/10 pb-4">
                        <CardTitle className="flex items-center text-lg">
                            <Ticket className="w-5 h-5 mr-2 text-blue-600" />
                            Elige tu tipo de entrada
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <TicketTypeSelector 
                            ticketTypes={ticketTypes}
                            selectedTypeId={selectedTicketTypeId}
                            onSelect={setSelectedTicketTypeId}
                        />
                    </CardContent>
                </Card>
            )}  
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center text-foreground">
            <Wallet className="w-5 h-5 mr-2 text-muted-foreground" /> Selecciona un método de pago
          </h2>
          
          {cuentas.length === 0 && !isLoading ? (
            <div className="text-center py-8 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground mb-2">No hay cuentas asociadas.</p>
                <Button variant="outline" size="sm">Vincular nueva cuenta</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cuentas.map((cuenta) => (
                <div
                  key={cuenta.id}
                  onClick={() => setSelectedCuentaId(cuenta.id)} 
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between hover:shadow-md",
                    selectedCuentaId === cuenta.id
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                      : "border-border bg-card hover:border-orange-300 dark:hover:border-orange-700/40"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center",
                      selectedCuentaId === cuenta.id
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-muted text-muted-foreground"
                    )}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{cuenta.banco}</p>
                      <p className="text-sm text-muted-foreground">{cuenta.tipoCuenta} •••• {cuenta.numeroCuenta.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold">S/ {cuenta.saldo.toFixed(2)}</span> 
                    {selectedCuentaId === cuenta.id && <CheckCircle2 className="w-6 h-6 text-orange-600" />}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            className="w-full py-6 text-lg bg-foreground text-background hover:bg-foreground/90 shadow-xl"
            disabled={!selectedCuentaId || (servicio.tipo_servicio === 'CINE' && selectedSeats.length === 0)}
            onClick={handleContinue}
          >
            {servicio.tipo_servicio === 'CINE' && selectedSeats.length === 0 
                ? "Selecciona butacas para continuar" 
                : <>Continuar al Checkout <ArrowRight className="ml-2 w-5 h-5" /></>
            }
          </Button>
        </div>
      </div>
    </div>
  )
}
export default PaymentSelectionPage