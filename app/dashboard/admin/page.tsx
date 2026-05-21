'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { AdminService, AdminKPIs } from '@/api/services/AdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp, DollarSign, ShoppingCart, Users, Package, LayoutGrid,
  ArrowRight, Clock, ChevronRight, Wallet, BarChart3, Activity,
  Shield, UserCheck, AlertTriangle, Zap,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';

const statCards = [
  { key: 'totalUsuarios', label: 'Usuarios', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { key: 'usuariosActivos', label: 'Activos', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  { key: 'totalAdmins', label: 'Admins', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { key: 'totalProductos', label: 'Productos', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  { key: 'totalServicios', label: 'Servicios', icon: LayoutGrid, color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/30' },
  { key: 'totalOrdenes', label: 'Órdenes', icon: ShoppingCart, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
];

const CHART_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ec4899'];
const STATUS_COLORS: Record<string, string> = {
  pendientes: '#f59e0b',
  confirmadas: '#22c55e',
  completadas: '#3b82f6',
  canceladas: '#ef4444',
};
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AdminService.getKPIs();
      setKpis(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const ratioActivos = kpis && kpis.totalUsuarios > 0
    ? Math.round((kpis.usuariosActivos / kpis.totalUsuarios) * 100) : 0;

  const chartData = kpis?.monthlyRevenue
    ? [...kpis.monthlyRevenue].reverse().map(r => ({
        name: `${MONTHS[r.month - 1]} ${r.year}`,
        Ingresos: Number(r.ingresos),
        Órdenes: r.ordenes,
      })).slice(-6)
    : [];

  const pieData = kpis ? [
    { name: 'Pendientes', value: kpis.ordersByStatus.pendientes },
    { name: 'Confirmadas', value: kpis.ordersByStatus.confirmadas },
    { name: 'Completadas', value: kpis.ordersByStatus.completadas },
    { name: 'Canceladas', value: kpis.ordersByStatus.canceladas },
  ].filter(d => d.value > 0) : [];

  const formatCurrency = (n: number) =>
    n != null ? new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(n) : '—';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Panel de Administración
            </h1>
            <p className="text-orange-100 mt-1">
              Bienvenido, <span className="font-semibold text-white">{user?.nombre}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {/* Revenue KPI */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium mb-2">
              <Wallet className="w-4 h-4" />
              Ingresos Totales
            </div>
            {loading ? <Skeleton className="h-7 w-24" /> : (
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {kpis ? formatCurrency(kpis.totalRevenue) : '—'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Avg Order KPI */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-medium mb-2">
              <TrendingUp className="w-4 h-4" />
              Ticket Promedio
            </div>
            {loading ? <Skeleton className="h-7 w-20" /> : (
              <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {kpis ? formatCurrency(kpis.averageOrderValue) : '—'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Today's Revenue KPI */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-600 text-xs font-medium mb-2">
              <Activity className="w-4 h-4" />
              Hoy
            </div>
            {loading ? <Skeleton className="h-7 w-20" /> : (
              <div>
                <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
                  {kpis ? formatCurrency(kpis.today.revenue) : '—'}
                </p>
                <p className="text-[10px] text-muted-foreground">{kpis?.today.orders || 0} órdenes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders KPI */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-rose-600 text-xs font-medium mb-2">
              <ShoppingCart className="w-4 h-4" />
              Órdenes
            </div>
            {loading ? <Skeleton className="h-7 w-16" /> : (
              <p className="text-xl font-bold text-rose-700 dark:text-rose-400">
                {kpis?.totalOrders ?? kpis?.totalOrdenes ?? '—'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Products KPI */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-600 text-xs font-medium mb-2">
              <Package className="w-4 h-4" />
              Productos
            </div>
            {loading ? <Skeleton className="h-7 w-16" /> : (
              <p className="text-xl font-bold text-orange-700 dark:text-orange-400">
                {kpis?.totalProductos ?? '—'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Services KPI */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/20 dark:to-teal-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-teal-600 text-xs font-medium mb-2">
              <LayoutGrid className="w-4 h-4" />
              Servicios
            </div>
            {loading ? <Skeleton className="h-7 w-16" /> : (
              <p className="text-xl font-bold text-teal-700 dark:text-teal-400">
                {kpis?.totalServicios ?? '—'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => {
          const value = kpis ? (kpis as any)[stat.key] : null;
          return (
            <Card key={stat.key} className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-3xl font-bold tracking-tight">{value ?? 0}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts + Quick Actions */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Ingresos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Bar dataKey="Ingresos" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No hay datos de ingresos disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by Status Pie */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Órdenes por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : pieData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toLowerCase()] || CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-2 justify-center">
                  {pieData.map(entry => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name.toLowerCase()] }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="font-semibold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Sin órdenes registradas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Health + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Health */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Salud del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : kpis ? (
              <>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Usuarios activos</span>
                    </div>
                    <span className="text-sm font-semibold">{kpis.usuariosActivos} / {kpis.totalUsuarios}</span>
                  </div>
                  <Progress value={ratioActivos} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{ratioActivos}% de los usuarios están activos</p>
                </div>
                <Separator />
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold">{kpis.totalClientes} clientes</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold">{kpis.totalAdmins} administradores</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <Package className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold">{kpis.totalProductos + kpis.totalServicios} productos + servicios</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <ShoppingCart className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-semibold">{kpis.totalOrdenes} órdenes totales</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-8">
                <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No se pudieron cargar las estadísticas.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Acceso Rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/admin/usuarios">
              <div className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-orange-200 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Usuarios</p>
                    <p className="text-xs text-muted-foreground">Gestionar usuarios del sistema</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
            <Link href="/dashboard/admin/productos">
              <div className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-orange-200 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Package className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Productos</p>
                    <p className="text-xs text-muted-foreground">Catálogo y stock</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
            <Link href="/dashboard/admin/servicios">
              <div className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-orange-200 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                    <LayoutGrid className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Servicios</p>
                    <p className="text-xs text-muted-foreground">Gestión de servicios</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
            <Link href="/dashboard/admin/administradores">
              <div className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-orange-200 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Administradores</p>
                    <p className="text-xs text-muted-foreground">Roles y permisos</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Refresh CTA */}
      <div className="flex justify-center">
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <Activity className="w-4 h-4" />
          Actualizar Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
