'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { AdminService, AdminRecord } from '@/lib/api/services/AdminService';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  RotateCcw,
  Search,
  Crown,
  Star,
  User,
} from 'lucide-react';

const nivelConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive'; icon: React.ElementType; desc: string }> = {
  super_admin: { label: 'Super Admin', variant: 'destructive', icon: Crown, desc: 'Acceso total al sistema' },
  admin: { label: 'Admin', variant: 'default', icon: ShieldCheck, desc: 'Gestión de usuarios y contenido' },
  moderator: { label: 'Moderator', variant: 'secondary', icon: Star, desc: 'Moderación básica' },
};

const AdminAdministradores = () => {
  const { user } = useAuth();
  const isDemo = user?.rol === 'DEMO';
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    adminId: string;
    adminName: string;
  }>({ open: false, adminId: '', adminName: '' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getAdministradores();
      setAdmins(data);
    } catch {
      toast.error('Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return admins;
    const q = search.toLowerCase();
    return admins.filter((a) =>
      a.usuario?.nombre?.toLowerCase().includes(q) ||
      a.usuario?.email?.toLowerCase().includes(q) ||
      a.nivelAcceso?.toLowerCase().includes(q)
    );
  }, [admins, search]);

  const handleDelete = async (adminId: string, adminName: string) => {
    try {
      await AdminService.deleteAdministrador(adminId);
      toast.success(`Administrador ${adminName} eliminado`);
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar administrador');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administradores</h1>
          <p className="text-muted-foreground mt-1">
            {admins.length} administrador{admins.length !== 1 ? 'es' : ''} en el sistema
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchAdmins}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o nivel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Admin List */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-orange-600" />
            Listado de Administradores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {search ? 'No se encontraron administradores.' : 'No hay administradores registrados.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((admin) => {
                const config = nivelConfig[admin.nivelAcceso] || { label: admin.nivelAcceso, variant: 'default' as const, icon: Shield, desc: '' };
                const Icon = config.icon;
                const isSelf = admin.usuario?.id === user?.id;

                return (
                  <div key={admin.id} className="flex items-center justify-between px-6 py-4 gap-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 font-semibold">
                          {admin.usuario?.nombre?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{admin.usuario?.nombre}</p>
                          {isSelf && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">Tú</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{admin.usuario?.email}</p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant={config.variant} className="capitalize gap-1">
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-0.5">{config.desc}</p>
                      </div>
                      {!isSelf && (
                        <Button
                          disabled={isDemo}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title={isDemo ? 'No disponible en modo demo' : ''}
                          onClick={() => setConfirmDialog({ open: true, adminId: admin.id, adminName: admin.usuario?.nombre || '' })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Administrador</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar a <strong>{confirmDialog.adminName}</strong> como administrador? Perderá todos sus permisos de administración.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, adminId: '', adminName: '' })}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await handleDelete(confirmDialog.adminId, confirmDialog.adminName);
                setConfirmDialog({ open: false, adminId: '', adminName: '' });
              }}
            >
              <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAdministradores;
