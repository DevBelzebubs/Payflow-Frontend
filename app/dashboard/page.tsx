'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { getMisCuentas, getMisOrdenes } from '@/api/services/PaymentService';
import { BankAccount } from '@/interfaces/BankAccounts/BankAccount';
import { Orders } from '@/interfaces/services/Orders';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // <--- Usado ahora
import { Skeleton } from "@/components/ui/skeleton" // <--- Usado ahora

// Icons
import {
  LayoutGrid,
  Package,
  History,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  TrendingUp,
  CalendarDays,
  ChevronRight,
  User
} from 'lucide-react';

import HeroCarousel from './components/layout/HeroCarousel';
import MercadoPagoBanner from './components/layout/banner/MercadoPagoBanner';

const Dashboard = () => {
  const { user, cliente } = useAuth();
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<Orders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      if (!cliente) return;
      try {
        const cuentas = await getMisCuentas();
        const saldo = cuentas.reduce((acc, cuenta) => acc + cuenta.saldo, 0);
        setTotalBalance(saldo);

        const ordenes = await getMisOrdenes(cliente.id);
        setRecentOrders(ordenes.slice(0, 3));
      } catch (error) {
        console.error("Error cargando datos del dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cliente]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 hidden md:block border-2 border-orange-100 dark:border-orange-900">
            <AvatarImage src={user?.avatar_url} alt={user?.nombre} />
            <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 font-bold">
              {user?.nombre?.charAt(0).toUpperCase() || <User className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {getGreeting()}, <span className="text-orange-600 dark:text-orange-400">{user?.nombre?.split(' ')[0]}</span>
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4" /> {today.charAt(0).toUpperCase() + today.slice(1)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button asChild variant="outline" className="hidden md:flex flex-1">
            <Link href="/dashboard/profile">Mi Perfil</Link>
          </Button>
          <Button asChild className="flex-1 md:flex-none shadow-md hover:shadow-lg transition-shadow">
            <Link href="/dashboard/products">Nueva Compra</Link>
          </Button>
        </div>
      </div>
      <HeroCarousel />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-orange-500 shadow-md bg-gradient-to-br from-card to-orange-50/50 dark:from-card dark:to-orange-950/10 transition-all hover:translate-y-[-2px]">
          <CardHeader className="pb-2">
            <CardDescription>Balance Total Disponible</CardDescription>
            <CardTitle className="text-4xl font-bold text-foreground flex items-center gap-2">
              {isLoading ? (
                <Skeleton className="h-10 w-32 rounded-md" />
              ) : (
                `S/ ${totalBalance.toFixed(2)}`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Disponible en tus cuentas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-all hover:border-orange-200 dark:hover:border-orange-800">
          <CardHeader className="pb-2">
            <CardDescription>Órdenes Recientes</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-10 rounded-md" /> : recentOrders.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Transacciones en el último periodo</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 text-white border-none shadow-lg dark:bg-orange-600 overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
            <div className="flex justify-between items-start">
              <Wallet className="w-8 h-8 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-md">
                PayFlow Wallet
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-white/80 text-sm">Gestiona tus tarjetas y cuentas</p>
              <Link href="/dashboard/profile/accounts" className="mt-2 inline-flex items-center text-sm font-bold hover:underline group/link">
                Ver mis cuentas <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <LayoutGrid className="w-5 h-5 text-orange-500" /> Qué quieres hacer hoy?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <Link href="/dashboard/services" className="group block h-full">
            <Card className="h-full border hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg cursor-pointer group-hover:-translate-y-1 bg-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">Pagar Servicios</h3>
                  <p className="text-sm text-muted-foreground">Luz, Agua, Cine y más</p>
                </div>
                <ChevronRight className="ml-auto text-muted-foreground group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/products" className="group block h-full">
            <Card className="h-full border hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg cursor-pointer group-hover:-translate-y-1 bg-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">Comprar Productos</h3>
                  <p className="text-sm text-muted-foreground">Explora el catálogo</p>
                </div>
                <ChevronRight className="ml-auto text-muted-foreground group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/history" className="group block h-full sm:col-span-2 lg:col-span-1">
            <Card className="h-full border hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg cursor-pointer group-hover:-translate-y-1 bg-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                  <History className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">Historial</h3>
                  <p className="text-sm text-muted-foreground">Revisa tus movimientos</p>
                </div>
                <ChevronRight className="ml-auto text-muted-foreground group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/30 pb-4">
          <div>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas transacciones procesadas.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/20">
            <Link href="/dashboard/history">Ver todo</Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((orden) => (
                <div key={orden.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowDownRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Orden <span className="text-muted-foreground font-normal">#{orden.id.slice(0, 8)}</span></p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(orden.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">- S/ {orden.total.toFixed(2)}</p>
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                      Completado
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">No hay actividad reciente.</p>
              <Button variant="link" asChild className="text-orange-600">
                <Link href="/dashboard/products">Realizar mi primera compra</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;