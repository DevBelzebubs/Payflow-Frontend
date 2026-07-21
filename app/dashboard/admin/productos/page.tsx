'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { AdminService, AdminProduct } from '@/lib/api/services/AdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Search,
  Package,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Save,
  X,
  Edit3,
  DollarSign,
  Box,
  ImageOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const AdminProductos = () => {
  const { user } = useAuth();
  const isDemo = user?.rol === 'DEMO';
  const [productos, setProductos] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    producto: AdminProduct | null;
    nombre: string;
    precio: number;
  }>({ open: false, producto: null, nombre: '', precio: 0 });

  const [stockDialog, setStockDialog] = useState<{
    open: boolean;
    productoId: string;
    productoNombre: string;
    cantidad: number;
  }>({ open: false, productoId: '', productoNombre: '', cantidad: 0 });

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getProductos();
      setProductos(data);
    } catch {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const filtered = useMemo(() => {
    const searched = productos.filter((p) =>
      p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(search.toLowerCase()) ||
      p.marca?.toLowerCase().includes(search.toLowerCase())
    );
    if (tab === 'active') return searched.filter((p) => p.activo);
    if (tab === 'inactive') return searched.filter((p) => !p.activo);
    if (tab === 'lowStock') return searched.filter((p) => p.stock <= 5);
    if (tab === 'outOfStock') return searched.filter((p) => p.stock === 0);
    return searched;
  }, [productos, search, tab]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  useEffect(() => { setPage(0); }, [search, tab]);

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { label: 'Sin stock', variant: 'destructive' as const };
    if (stock <= 5) return { label: 'Stock bajo', variant: 'secondary' as const };
    return { label: 'Disponible', variant: 'default' as const };
  };

  const handleDelete = async (id: string, nombre: string) => {
    try {
      await AdminService.deleteProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Producto "${nombre}" eliminado`);
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar producto');
    }
  };

  const handleToggleActivo = async (id: string, current: boolean) => {
    try {
      const updated = await AdminService.updateProducto(id, { activo: !current });
      setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, activo: updated.activo } : p)));
      toast.success(`Producto ${updated.activo ? 'activado' : 'desactivado'}`);
    } catch (error: any) {
      toast.error(error.message || 'Error al cambiar estado');
    }
  };

  const handleSaveEdit = async () => {
    const prod = editDialog.producto;
    if (!prod) return;
    try {
      const updated = await AdminService.updateProducto(prod.id, {
        nombre: editDialog.nombre,
        precio: editDialog.precio,
      });
      setProductos((prev) => prev.map((p) => (p.id === prod.id ? { ...p, nombre: updated.nombre, precio: updated.precio } : p)));
      toast.success('Producto actualizado');
      setEditDialog({ open: false, producto: null, nombre: '', precio: 0 });
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar producto');
    }
  };

  const handleStockChange = async () => {
    if (stockDialog.cantidad === 0) {
      setStockDialog({ ...stockDialog, open: false });
      return;
    }
    try {
      const updated = await AdminService.updateProductoStock(stockDialog.productoId, stockDialog.cantidad);
      setProductos((prev) => prev.map((p) => (p.id === stockDialog.productoId ? { ...p, stock: updated.stock } : p)));
      toast.success(`Stock actualizado: ${updated.stock} unidades`);
      setStockDialog({ ...stockDialog, open: false });
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar stock');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} de {productos.length} productos |{' '}
            {productos.filter((p) => p.activo).length} activos,{' '}
            {productos.filter((p) => !p.activo).length} inactivos
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchProductos}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, categoría o marca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos</TabsTrigger>
          <TabsTrigger value="lowStock">Stock Bajo</TabsTrigger>
          <TabsTrigger value="outOfStock">Sin Stock</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="w-5 h-5 text-orange-600" />
            Catálogo de Productos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No se encontraron productos.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {paginated.map((producto) => {
                const stockBadge = getStockBadge(producto.stock);
                return (
                  <div key={producto.id}>
                    <div className="flex items-center justify-between px-6 py-4 gap-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                          {producto.imagen_url ? (
                            <img
                              src={producto.imagen_url}
                              alt={producto.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageOff className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{producto.nombre}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{producto.categoria || 'Sin categoría'}</span>
                            {producto.marca && <><span>•</span><span>{producto.marca}</span></>}
                          </div>
                        </div>
                      </div>
                      <div className="hidden lg:flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-sm">S/ {producto.precio.toFixed(2)}</p>
                        </div>
                        <div className="text-right min-w-[70px]">
                          <p className={`text-sm font-medium ${producto.stock === 0 ? 'text-destructive' : producto.stock <= 5 ? 'text-amber-600' : ''}`}>
                            {producto.stock} uds.
                          </p>
                        </div>
                        <Badge variant={stockBadge.variant} className="capitalize">
                          {stockBadge.label}
                        </Badge>
                        <Badge variant={producto.activo ? 'default' : 'secondary'}>
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(expandedId === producto.id ? null : producto.id)}
                      >
                        {expandedId === producto.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* Expanded Detail */}
                    {expandedId === producto.id && (
                      <div className="px-6 pb-4 space-y-4 bg-muted/20">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm pt-2">
                          <div>
                            <p className="text-muted-foreground text-xs">Categoría</p>
                            <p className="font-medium">{producto.categoria || '—'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Marca</p>
                            <p className="font-medium">{producto.marca || '—'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Precio</p>
                            <p className="font-semibold">S/ {producto.precio.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Stock</p>
                            <p className={`font-medium ${producto.stock === 0 ? 'text-destructive' : ''}`}>
                              {producto.stock} unidades
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Rating</p>
                            <p className="font-medium">{producto.rating_promedio?.toFixed(1) || '—'} ({producto.total_reseñas || 0} reseñas)</p>
                          </div>
                        </div>
                        {producto.descripcion && (
                          <>
                            <Separator />
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Descripción</p>
                              <p className="text-sm">{producto.descripcion}</p>
                            </div>
                          </>
                        )}
                        <Separator />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            disabled={isDemo}
                            variant="outline"
                            size="sm"
                            title={isDemo ? 'No disponible en modo demo' : ''}
                            onClick={() => {
                              setEditDialog({
                                open: true,
                                producto,
                                nombre: producto.nombre,
                                precio: producto.precio,
                              });
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-1.5" /> Editar
                          </Button>
                          <Button
                            disabled={isDemo}
                            variant="outline"
                            size="sm"
                            title={isDemo ? 'No disponible en modo demo' : ''}
                            onClick={() => handleToggleActivo(producto.id, producto.activo)}
                          >
                            {producto.activo ? <><EyeOff className="w-4 h-4 mr-1.5" /> Desactivar</> : <><Eye className="w-4 h-4 mr-1.5" /> Activar</>}
                          </Button>
                          <Button
                            disabled={isDemo}
                            variant="outline"
                            size="sm"
                            title={isDemo ? 'No disponible en modo demo' : ''}
                            onClick={() => setStockDialog({
                              open: true,
                              productoId: producto.id,
                              productoNombre: producto.nombre,
                              cantidad: 0,
                            })}
                          >
                            <Box className="w-4 h-4 mr-1.5" /> Ajustar Stock
                          </Button>
                          <Button
                            disabled={isDemo}
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            title={isDemo ? 'No disponible en modo demo' : ''}
                            onClick={() => {
                              const prodName = producto.nombre;
                              const prodId = producto.id;
                              handleDelete(prodId, prodName);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Página {page + 1} de {pageCount}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                {Array.from({ length: Math.min(pageCount, 7) }).map((_, i) => (
                  <Button
                    key={i}
                    variant={i === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pageCount - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open && editDialog.producto !== null}
        onOpenChange={(open) => {
          if (!open) setEditDialog({ open: false, producto: null, nombre: '', precio: 0 });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica el nombre y precio del producto.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nombre</label>
              <Input
                value={editDialog.nombre}
                onChange={(e) => setEditDialog({ ...editDialog, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Precio (S/)</label>
              <Input
                type="number"
                step="0.01"
                value={editDialog.precio}
                onChange={(e) => setEditDialog({ ...editDialog, precio: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialog({ open: false, producto: null, nombre: '', precio: 0 })}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="w-4 h-4 mr-1.5" /> Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Dialog */}
      <Dialog
        open={stockDialog.open}
        onOpenChange={(open) => {
          if (!open) setStockDialog({ ...stockDialog, open: false });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Stock</DialogTitle>
            <DialogDescription>
              Ingresa el cambio de stock para <strong>{stockDialog.productoNombre}</strong> (positivo para añadir, negativo para reducir).
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setStockDialog({ ...stockDialog, cantidad: stockDialog.cantidad - 1 })}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={stockDialog.cantidad}
              onChange={(e) => setStockDialog({ ...stockDialog, cantidad: Number(e.target.value) })}
              className="text-center text-lg font-semibold"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setStockDialog({ ...stockDialog, cantidad: stockDialog.cantidad + 1 })}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setStockDialog({ ...stockDialog, open: false })}>
              Cancelar
            </Button>
            <Button onClick={handleStockChange}>
              <Save className="w-4 h-4 mr-1.5" /> Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductos;
