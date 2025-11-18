'use client'
import { cancelarOrden, getMisOrdenes } from '@/api/services/PaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/useAuth';
import { Orders } from '@/interfaces/services/Orders';
import { AlertCircle, HistoryIcon, Loader2, Package, Ticket } from 'lucide-react';
import React, { useEffect, useState } from 'react'
const HistoryPage = () => {
    const { cliente, loading: authLoading } = useAuth();
    const [ordenes, setOrdenes] = useState<Orders[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const loadData = async (clienteId: string) => {
        try {
            const data = await getMisOrdenes(clienteId);
            setOrdenes(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!authLoading && cliente) {
            loadData(cliente.id);
        }
    }, [cliente, authLoading]);
    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                <p className="ml-3 text-lg text-muted-foreground">Cargando historial...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-destructive/10 border border-destructive/30 rounded-lg p-6">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="mt-4 text-lg font-semibold text-destructive">{error}</p>
            </div>
        );
    }
    return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center">
        <HistoryIcon className="w-8 h-8 mr-3 text-orange-500" />
        Mi Historial de Órdenes
      </h1>

      {ordenes?.length === 0 ? (
        <p className="text-muted-foreground">No tienes órdenes registradas.</p>
      ) : (
        <div className="space-y-6">
          {ordenes?.map((orden) => (
            <Card key={orden.id} className="shadow-sm bg-card border-border">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-lg text-foreground">Orden #{orden.id.split('-')[0]}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(orden.createdAt).toLocaleDateString('es-ES', { 
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-t border-b border-border divide-y divide-border">
                  {orden.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-3">
                      <div className="flex items-center">
                        {item.producto_id ? <Package className="w-5 h-5 mr-3 text-muted-foreground/70" /> : <Ticket className="w-5 h-5 mr-3 text-muted-foreground/70" />}
                        <div>
                          <p className="font-medium text-foreground">
                            {item.producto_id ? `Producto (ID: ...${item.producto_id.slice(-4)})` : `Servicio (ID: ...${item.servicio_id.slice(-4)})`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.cantidad} x S/ {item.precio_unitario.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-foreground">S/ {item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="justify-between items-center pt-4 mt-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Pagado</p>
                    <p className="text-2xl font-bold text-orange-600">
                      S/ {orden.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default HistoryPage;