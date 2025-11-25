'use client'
import { getMisOrdenes } from '@/api/services/PaymentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/useAuth';
import useCart from '@/hooks/cart/useCart';
import { Orders } from '@/interfaces/services/Orders';
import { AlertCircle, HistoryIcon, Loader2, Package, Ticket } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react'

const HistoryPage = () => {
    const { cliente, loading: authLoading } = useAuth();
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [ordenes, setOrdenes] = useState<Orders[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore,setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 10;
    const observer = useRef<IntersectionObserver | null>(null);
    const lastOrderElementRef = useCallback((node: HTMLDivElement) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);
    useEffect(()=>{
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        if (status === 'success' && type === 'cart') {
            clearCart();
            router.replace('/dashboard/history');
        }
    },[searchParams, clearCart, router]);
    useEffect(() => {
        if (authLoading || !cliente) return;

        const loadData = async () => {
            try {
                if (page === 1) setLoading(true);
                else setLoadingMore(true);
                const newOrders = await getMisOrdenes(cliente.id, page, limit);
                setOrdenes(prev => {
                    return page === 1 ? newOrders : [...prev, ...newOrders];
                });
                setHasMore(newOrders.length === limit);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        }

        loadData();
    }, [cliente, authLoading, page]);
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
        if (cliente?.id) {
            setOrdenes([]);
            setPage(1);
            setHasMore(true);
        }
    }, [cliente?.id]);

    if (loading && page === 1) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                <p className="ml-3 text-lg text-muted-foreground">Cargando historial...</p>
            </div>
        );
    }

    if (error && page === 1) {
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
                                    <CardTitle className="text-lg text-foreground">Orden #{orden.id.slice(0, 8)}</CardTitle> {/* Slice seguro aquí también */}
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(orden.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="border-t border-b border-border divide-y divide-border">
                                    {orden.items.map((item: any, index: number) => {
                                        // Lógica de visualización segura
                                        const isProduct = !!item.producto_id;
                                        const idToDisplay = isProduct ? item.producto_id : item.servicio_id;
                                        // Usamos ?.slice() y un fallback por si acaso es null
                                        const shortId = idToDisplay?.toString().slice(-4) || '????'; 

                                        return (
                                            <div key={index} className="flex justify-between items-center py-3">
                                                <div className="flex items-center">
                                                    {isProduct ? (
                                                        <Package className="w-5 h-5 mr-3 text-muted-foreground/70" />
                                                    ) : (
                                                        <Ticket className="w-5 h-5 mr-3 text-muted-foreground/70" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {isProduct ? 'Producto' : 'Servicio'} <span className="text-xs text-muted-foreground font-normal">(ID: ...{shortId})</span>
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.cantidad} x S/ {item.precio_unitario.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-foreground">S/ {item.subtotal.toFixed(2)}</p>
                                            </div>
                                        );
                                    })}
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
                    {loadingMore && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                        </div>
                    )}
                    {!hasMore && ordenes.length > 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            Has llegado al final del historial.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
export default HistoryPage;