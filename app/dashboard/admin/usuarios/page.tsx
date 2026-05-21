'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { AdminService, AdminUser } from '@/api/services/AdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Search,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  MoreHorizontal,
  Filter,
  Users,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const nivelAccesoOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'moderator', label: 'Moderator' },
];

const ITEMS_PER_PAGE = 10;

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
  }>({ open: false, title: '', description: '', action: async () => {} });

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getUsuarios();
      setUsuarios(data);
    } catch {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filtered = useMemo(() => {
    const searched = usuarios.filter((u) =>
      u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.dni?.includes(search)
    );
    if (tab === 'active') return searched.filter((u) => u.activo);
    if (tab === 'inactive') return searched.filter((u) => !u.activo);
    if (tab === 'admins') return searched.filter((u) => u.rol === 'ADMIN' || u.rol === 'admin');
    return searched;
  }, [usuarios, search, tab]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  useEffect(() => { setPage(0); }, [search, tab]);

  const askConfirm = (title: string, description: string, action: () => Promise<void>) => {
    setConfirmDialog({ open: true, title, description, action });
  };

  const handleToggleActivo = async (id: string, nombre: string, current: boolean) => {
    try {
      const updated = await AdminService.toggleUsuarioActivo(id);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, activo: updated.activo } : u))
      );
      toast.success(`Usuario ${nombre} ${updated.activo ? 'activado' : 'desactivado'}`);
    } catch (error: any) {
      toast.error(error.message || 'Error al cambiar estado');
    }
  };

  const handleRolChange = async (id: string, newRol: string, nivelAcceso?: string) => {
    try {
      const updated = await AdminService.updateUsuarioRol(id, newRol, nivelAcceso);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: updated.rol, admin_id: newRol === 'ADMIN' ? 'pending' : null, nivelAcceso: nivelAcceso || null } : u))
      );
      toast.success(`Rol actualizado a ${newRol === 'ADMIN' ? 'Administrador' : 'Cliente'}`);
      fetchUsuarios();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar rol');
    }
  };

  const handleMakeAdmin = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Hacer Administrador',
      description: '¿A qué nivel de acceso quieres asignar a este usuario? Primero selecciona en el panel.',
      action: async () => {},
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} de {usuarios.length} usuarios
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchUsuarios}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v)}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos</TabsTrigger>
          <TabsTrigger value="admins">Administradores</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Listado de Usuarios</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No se encontraron usuarios.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {paginated.map((usuario) => (
                <div key={usuario.id}>
                  <div className="flex items-center justify-between px-6 py-4 gap-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 font-semibold text-sm">
                          {usuario.nombre?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{usuario.nombre}</p>
                          {!usuario.activo && (
                            <span className="w-2 h-2 rounded-full bg-destructive shrink-0" title="Inactivo" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{usuario.email}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      {usuario.rol === 'ADMIN' || usuario.rol === 'admin' ? (
                        <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                          {usuario.nivelAcceso && ` · ${usuario.nivelAcceso}`}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Cliente</Badge>
                      )}
                      <Badge variant={usuario.activo ? 'default' : 'destructive'} className="capitalize">
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(expandedId === usuario.id ? null : usuario.id)}
                      >
                        {expandedId === usuario.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {expandedId === usuario.id && (
                    <div className="px-6 pb-4 space-y-4 bg-muted/20">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm pt-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-xs">DNI</p>
                            <p className="font-medium">{usuario.dni || '—'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-xs">Teléfono</p>
                            <p className="font-medium">{usuario.telefono || '—'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-xs">Registro</p>
                            <p className="font-medium">
                              {usuario.created_at
                                ? new Date(usuario.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })
                                : '—'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-xs">Nivel Admin</p>
                            <p className="font-medium capitalize">{usuario.nivelAcceso || '—'}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          variant={usuario.activo ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => {
                            askConfirm(
                              `${usuario.activo ? 'Desactivar' : 'Activar'} usuario`,
                              `¿Estás seguro de ${usuario.activo ? 'desactivar' : 'activar'} a ${usuario.nombre}?`,
                              async () => { await handleToggleActivo(usuario.id, usuario.nombre, usuario.activo); }
                            );
                          }}
                        >
                          {usuario.activo ? <><UserX className="w-4 h-4 mr-1.5" /> Desactivar</> : <><UserCheck className="w-4 h-4 mr-1.5" /> Activar</>}
                        </Button>

                        {usuario.rol !== 'ADMIN' && usuario.rol !== 'admin' ? (
                          <div className="flex items-center gap-2">
                            <Select
                              onValueChange={(val) => {
                                handleRolChange(usuario.id, 'ADMIN', val);
                              }}
                            >
                              <SelectTrigger className="h-9 w-44">
                                <Shield className="w-4 h-4 mr-1.5 text-purple-600" />
                                <SelectValue placeholder="Ascender a Admin" />
                              </SelectTrigger>
                              <SelectContent>
                                {nivelAccesoOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              askConfirm(
                                'Quitar Administrador',
                                `¿Estás seguro de quitarle permisos de administrador a ${usuario.nombre}?`,
                                async () => { await handleRolChange(usuario.id, 'CLIENTE'); }
                              );
                            }}
                          >
                            <ShieldOff className="w-4 h-4 mr-1.5" /> Quitar Admin
                          </Button>
                        )}
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
                {Array.from({ length: pageCount }).map((_, i) => (
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

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await confirmDialog.action();
                setConfirmDialog({ ...confirmDialog, open: false });
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsuarios;
