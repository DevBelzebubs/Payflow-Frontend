'use client'
import { cancelarSuscripcion, getMisSuscripciones } from '@/api/services/SubscriptionService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/useAuth'
import { Suscription } from '@/interfaces/services/Suscription';
import { CalendarDays, CheckCircle2, CreditCard, Loader2, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const SuscriptionPages = () => {
    const { cliente } = useAuth();
    const [suscripciones, setSuscripciones] = useState<Suscription[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (cliente) {
            loadData();
        }
    }, [cliente]);
    const loadData = async () => {
        try {
            setLoading(true);
            if (!cliente) return;
            const data = await getMisSuscripciones(cliente.id);
            setSuscripciones(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = async (id: string) => {
        if (!confirm("¿Estás seguro de cancelar esta suscripción?")) return;
        try {
            await cancelarSuscripcion(id);
            toast.success("Suscripción cancelada");
            loadData();
        } catch (error) {
            toast.error("Error al cancelar");
        }
    }
    const getStatusBadge = (estado: string) => {
        switch (estado) {
            case 'ACTIVA':
                return <Badge className='bg-green-100 text-green-700 hover:bg-green-200 border-green-200'>Activa</Badge>;
            case 'MOROSA':
                return <Badge variant="destructive">Pago Pendiente</Badge>;
            default:
                return <Badge variant="secondary">Cancelada</Badge>;
        }
    }
    if (loading) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-orange-500 w-10 h-10"/></div>;
  }
return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Mis Suscripciones</h1>
        <p className="text-muted-foreground">Gestiona tus servicios recurrentes y pagos automáticos.</p>
      </div>

      {suscripciones.length === 0 ? (
        <Card className="border-dashed p-8 text-center bg-muted/30">
          <div className="flex justify-center mb-4">
            <CreditCard className="w-12 h-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">No tienes suscripciones activas</h3>
          <p className="text-muted-foreground mt-2">Cuando te suscribas a un servicio, aparecerá aquí.</p>
          <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => window.location.href='/dashboard/services'}>
            Explorar Servicios
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suscripciones.map((sub) => (
            <Card key={sub.id} className="flex flex-col justify-between border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{sub.nombre_servicio}</CardTitle>
                    {getStatusBadge(sub.estado)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Costo Mensual</span>
                    <span className="font-bold text-lg">S/ {sub.precio_acordado.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Iniciado: {new Date(sub.fecha_inicio).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CalendarDays className="w-4 h-4 text-orange-500" />
                        <span>Próximo cobro: {new Date(sub.fecha_proximo_pago).toLocaleDateString()}</span>
                    </div>
                </div>
              </CardContent>
              
              {sub.estado === 'ACTIVA' && (
                  <CardFooter className="pt-2">
                    <Button 
                        variant="ghost" 
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleCancel(sub.id)}
                    >
                        <XCircle className="w-4 h-4 mr-2" /> Cancelar Suscripción
                    </Button>
                  </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default SuscriptionPages;