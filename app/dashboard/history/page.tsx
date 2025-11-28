'use client'
import { getMisOrdenes } from '@/api/services/PaymentService';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/useAuth';
import useCart from '@/hooks/cart/useCart';
import { Orders } from '@/interfaces/services/Orders';
import { 
    AlertCircle, 
    History, 
    Loader2, 
    Package, 
    Ticket, 
    Calendar, 
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Receipt
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
    const { cliente, loading: authLoading } = useAuth();
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [ordenes, setOrdenes] = useState<Orders[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 6;

    useEffect(()=>{
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        if (status === 'success' && type === 'cart') {
            clearCart();
            router.replace('/dashboard/history');
        }
    },[searchParams, clearCart, router]);

    useEffect(() => {
        if (authLoading) return;
        
        if (!cliente) {
             setLoading(false);
             return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                const data = await getMisOrdenes(cliente.id, page, limit);
                setOrdenes(data);
                
                setHasMore(data.length === limit);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Error al cargar el historial');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [cliente, authLoading, page]);

    const handleNextPage = () => {
        if (hasMore) setPage(p => p + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    if (loading && ordenes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
                    <Loader2 className="relative w-12 h-12 text-orange-500 animate-spin" />
                </div>
                <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">Cargando tu historial...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                <div className="bg-destructive/10 p-6 rounded-full mb-4">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Hubo un problema</h3>
                <p className="text-muted-foreground mt-2 text-center max-w-md">{error}</p>
                <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => window.location.reload()}
                >
                    Intentar nuevamente
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
            <div className="border-b border-border/50 pb-6">
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <History className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    Mi Historial de Órdenes
                </h1>
                <p className="text-muted-foreground mt-2 ml-1">
                    Revisa el detalle de tus transacciones y compras pasadas.
                </p>
            </div>

            {ordenes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
                    <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                        <Receipt className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Aún no tienes órdenes</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                        Tus compras y pagos aparecerán aquí.
                    </p>
                    <Button variant="link" className="text-orange-600 mt-2" onClick={() => router.push('/dashboard/products')}>
                        Ir a comprar
                    </Button>
                </div>
            ) : (
                <>
                    <motion.div layout className="grid gap-6">
                        <AnimatePresence mode="popLayout">
                            {ordenes.map((orden, index) => (
                                <motion.div
                                    key={orden.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card className="overflow-hidden border-border/60 hover:border-orange-500/30 hover:shadow-md transition-all duration-300">
                                        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-muted/30 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base font-semibold">
                                                        Orden #{orden.id.slice(0, 8).toUpperCase()}
                                                    </CardTitle>
                                                    <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {new Date(orden.createdAt).toLocaleDateString('es-ES', {
                                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="mt-3 sm:mt-0 w-fit border-green-200 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                                Completado
                                            </Badge>
                                        </CardHeader>
                                        
                                        <CardContent className="pt-6">
                                            <div className="space-y-1">
                                                {orden.items.map((item: any, idx: number) => {
                                                    const isProduct = !!item.producto_id;
                                                    const idDisplay = (isProduct ? item.producto_id : item.servicio_id)?.toString().slice(-4) || 'REF';

                                                    return (
                                                        <div key={idx} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0 last:pb-0">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-md ${isProduct ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'}`}>
                                                                    {isProduct ? <Package className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-sm text-foreground">
                                                                        {isProduct ? 'Producto' : 'Servicio'} 
                                                                        <span className="text-xs text-muted-foreground ml-2 font-mono">ID: {idDisplay}</span>
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Cantidad: {item.cantidad} &times; S/ {item.precio_unitario.toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="font-semibold text-foreground text-sm">
                                                                S/ {item.subtotal.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="bg-muted/20 flex justify-between items-center py-4">
                                            <span className="text-sm font-medium text-muted-foreground">Total Pagado</span>
                                            <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                                S/ {orden.total.toFixed(2)}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-border/50">
                        <Button
                            variant="outline"
                            onClick={handlePrevPage}
                            disabled={page === 1 || loading}
                            className="w-32"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
                        </Button>

                        <span className="text-sm font-medium text-muted-foreground">
                            Página {page}
                        </span>

                        <Button
                            variant="outline"
                            onClick={handleNextPage}
                            disabled={!hasMore || loading}
                            className="w-32"
                        >
                            Siguiente <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
export default HistoryPage;