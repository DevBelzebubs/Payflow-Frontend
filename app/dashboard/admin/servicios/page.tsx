'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { AdminService, AdminServicio } from '@/lib/api/services/AdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Search, LayoutGrid, Trash2, RotateCcw, ChevronDown, ChevronUp,
  Plus, Save, X, Eye, EyeOff, ImageOff, AlertTriangle, DollarSign, Tag, Type,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;
const tipoOptions = [
  { value: 'UTILIDAD', label: 'Utilidad' },
  { value: 'ENTRETENIMIENTO', label: 'Entretenimiento' },
];

const AdminServicios = () => {
  const { user } = useAuth();
  const isDemo = user?.rol === 'DEMO';
  const [servicios, setServicios] = useState<AdminServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    servicio: AdminServicio | null;
    nombre: string;
    descripcion: string;
    recibo: number;
    tipo_servicio: string;
    proveedor: string;
  }>({ open: false, servicio: null, nombre: '', descripcion: '', recibo: 0, tipo_servicio: 'UTILIDAD', proveedor: '' });

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: '', descripcion: '', recibo: 0, tipo_servicio: 'UTILIDAD' as string, proveedor: '',
  });

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getServicios();
      setServicios(data);
    } catch {
      toast.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServicios(); }, []);

  const filtered = useMemo(() => {
    const searched = servicios.filter(s =>
      s.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      s.tipo_servicio?.toLowerCase().includes(search.toLowerCase()) ||
      s.proveedor?.toLowerCase().includes(search.toLowerCase())
    );
    if (tab === 'active') return searched.filter(s => s.activo);
    if (tab === 'inactive') return searched.filter(s => !s.activo);
    if (tab === 'utilidad') return searched.filter(s => s.tipo_servicio === 'UTILIDAD');
    if (tab === 'entretenimiento') return searched.filter(s => s.tipo_servicio === 'ENTRETENIMIENTO');
    return searched;
  }, [servicios, search, tab]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  useEffect(() => { setPage(0); }, [search, tab]);

  const handleToggleActivo = async (id: string, current: boolean) => {
    try {
      const updated = await AdminService.updateServicio(id, { activo: !current });
      setServicios(prev => prev.map(s => s.idServicio === id ? { ...s, activo: updated.activo } : s));
      toast.success(`Servicio ${updated.activo ? 'activado' : 'desactivado'}`);
    } catch (error: any) {
      toast.error(error.message || 'Error al cambiar estado');
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    try {
      await AdminService.deleteServicio(id);
      setServicios(prev => prev.filter(s => s.idServicio !== id));
      toast.success(`Servicio "${nombre}" eliminado`);
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar servicio');
    }
  };

  const handleSaveEdit = async () => {
    const sv = editDialog.servicio;
    if (!sv) return;
    try {
      const updated = await AdminService.updateServicio(sv.idServicio, {
        nombre: editDialog.nombre,
        descripcion: editDialog.descripcion,
        recibo: editDialog.recibo,
        tipo_servicio: editDialog.tipo_servicio,
        proveedor: editDialog.proveedor,
      });
      setServicios(prev => prev.map(s => s.idServicio === sv.idServicio ? { ...s, ...updated } : s));
      toast.success('Servicio actualizado');
      setEditDialog({ open: false, servicio: null, nombre: '', descripcion: '', recibo: 0, tipo_servicio: 'UTILIDAD', proveedor: '' });
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar servicio');
    }
  };

  const handleCreate = async () => {
    if (!createForm.nombre.trim()) { toast.error('El nombre es requerido'); return; }
    try {
      const created = await AdminService.createServicio(createForm);
      setServicios(prev => [created, ...prev]);
      toast.success('Servicio creado');
      setCreateOpen(false);
      setCreateForm({ nombre: '', descripcion: '', recibo: 0, tipo_servicio: 'UTILIDAD', proveedor: '' });
    } catch (error: any) {
      toast.error(error.message || 'Error al crear servicio');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} de {servicios.length} servicios
          </p>
        </div>
        <div className="flex gap-2">
          <Button disabled={isDemo} onClick={() => setCreateOpen(true)} title={isDemo ? 'No disponible en modo demo' : ''}>
            <Plus className="w-4 h-4 mr-1.5" /> Nuevo Servicio
          </Button>
          <Button variant="outline" size="icon" onClick={fetchServicios}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, tipo o proveedor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={v => setTab(v)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos</TabsTrigger>
          <TabsTrigger value="utilidad">Utilidad</TabsTrigger>
          <TabsTrigger value="entretenimiento">Entretenimiento</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* List */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <LayoutGrid className="w-5 h-5 text-teal-600" />
            Catálogo de Servicios
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
              <LayoutGrid className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No se encontraron servicios.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {paginated.map(servicio => (
                <div key={servicio.idServicio}>
                  <div className="flex items-center justify-between px-6 py-4 gap-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                        {servicio.imagenURL ? (
                          <img src={servicio.imagenURL} alt={servicio.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{servicio.nombre}</p>
                          {servicio.proveedor && (
                            <Badge variant="outline" className="text-[10px] px-1.5 h-5">{servicio.proveedor}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-[10px] px-1.5 h-5 gap-1">
                            <Tag className="w-3 h-3" />
                            {servicio.tipo_servicio}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-sm">S/ {servicio.recibo.toFixed(2)}</p>
                      </div>
                      <Badge variant={servicio.activo ? 'default' : 'secondary'}>
                        {servicio.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setExpandedId(expandedId === servicio.idServicio ? null : servicio.idServicio)}
                    >
                      {expandedId === servicio.idServicio ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Expanded */}
                  {expandedId === servicio.idServicio && (
                    <div className="px-6 pb-4 space-y-4 bg-muted/20">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm pt-2">
                        <div>
                          <p className="text-muted-foreground text-xs">Tipo</p>
                          <p className="font-medium capitalize">{servicio.tipo_servicio.toLowerCase()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Proveedor</p>
                          <p className="font-medium">{servicio.proveedor || '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Precio</p>
                          <p className="font-semibold">S/ {servicio.recibo.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Rating</p>
                          <p className="font-medium">{servicio.rating ?? '—'}</p>
                        </div>
                      </div>
                      {servicio.descripcion && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Descripción</p>
                            <p className="text-sm">{servicio.descripcion}</p>
                          </div>
                        </>
                      )}
                      <Separator />
                      <div className="flex flex-wrap gap-2">
                        <Button disabled={isDemo} variant="outline" size="sm" title={isDemo ? 'No disponible en modo demo' : ''} onClick={() => {
                          setEditDialog({
                            open: true, servicio,
                            nombre: servicio.nombre,
                            descripcion: servicio.descripcion || '',
                            recibo: servicio.recibo,
                            tipo_servicio: servicio.tipo_servicio,
                            proveedor: servicio.proveedor || '',
                          });
                        }}>
                          <Save className="w-4 h-4 mr-1.5" /> Editar
                        </Button>
                        <Button disabled={isDemo} variant="outline" size="sm" title={isDemo ? 'No disponible en modo demo' : ''} onClick={() => handleToggleActivo(servicio.idServicio, servicio.activo)}>
                          {servicio.activo ? <><EyeOff className="w-4 h-4 mr-1.5" /> Desactivar</> : <><Eye className="w-4 h-4 mr-1.5" /> Activar</>}
                        </Button>
                        <Button disabled={isDemo} variant="outline" size="sm" className="text-destructive hover:text-destructive" title={isDemo ? 'No disponible en modo demo' : ''}
                          onClick={() => handleDelete(servicio.idServicio, servicio.nombre)}>
                          <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Página {page + 1} de {pageCount}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
                {Array.from({ length: Math.min(pageCount, 7) }).map((_, i) => (
                  <Button key={i} variant={i === page ? 'default' : 'outline'} size="sm" onClick={() => setPage(i)}>{i + 1}</Button>
                ))}
                <Button variant="outline" size="sm" disabled={page >= pageCount - 1} onClick={() => setPage(p => p + 1)}>Siguiente</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open && editDialog.servicio !== null}
        onOpenChange={open => { if (!open) setEditDialog({ ...editDialog, open: false }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>Modifica los datos del servicio.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nombre</label>
              <Input value={editDialog.nombre} onChange={e => setEditDialog({ ...editDialog, nombre: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Descripción</label>
              <Textarea value={editDialog.descripcion} onChange={e => setEditDialog({ ...editDialog, descripcion: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Precio (S/)</label>
                <Input type="number" step="0.01" value={editDialog.recibo}
                  onChange={e => setEditDialog({ ...editDialog, recibo: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <Select value={editDialog.tipo_servicio}
                  onValueChange={v => setEditDialog({ ...editDialog, tipo_servicio: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tipoOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Proveedor</label>
              <Input value={editDialog.proveedor} onChange={e => setEditDialog({ ...editDialog, proveedor: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialog({ ...editDialog, open: false })}>Cancelar</Button>
            <Button onClick={handleSaveEdit}><Save className="w-4 h-4 mr-1.5" /> Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Servicio</DialogTitle>
            <DialogDescription>Completa los datos para crear un nuevo servicio.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nombre *</label>
              <Input value={createForm.nombre} onChange={e => setCreateForm({ ...createForm, nombre: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Descripción</label>
              <Textarea value={createForm.descripcion} onChange={e => setCreateForm({ ...createForm, descripcion: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Precio (S/)</label>
                <Input type="number" step="0.01" value={createForm.recibo}
                  onChange={e => setCreateForm({ ...createForm, recibo: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <Select value={createForm.tipo_servicio}
                  onValueChange={v => setCreateForm({ ...createForm, tipo_servicio: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tipoOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Proveedor</label>
              <Input value={createForm.proveedor} onChange={e => setCreateForm({ ...createForm, proveedor: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-1.5" /> Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServicios;
