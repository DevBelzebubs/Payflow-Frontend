'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/useAuth';

import { LayoutGrid, Package, History } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import HeroCarousel from './components/layout/HeroCarousel';
import MercadoPagoBanner from './components/layout/banner/MercadoPagoBanner';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <HeroCarousel></HeroCarousel>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        ¡Bienvenido, {user?.nombre}!
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gestiona tus pagos y productos desde un solo lugar.
      </p>
      <Card className="bg-card border shadow-sm">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Selecciona qué te gustaría hacer a continuación.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Link href="/dashboard/services" passHref>
            <Button variant="outline" size="lg" className="w-full h-24 text-lg justify-start p-6 border-orange-200 dark:border-orange-500/30 hover:bg-orange-50 dark:hover:bg-orange-900/20  hover:text-orange-700 dark:hover:text-orange-400 group">
              <LayoutGrid className="w-6 h-6 mr-4 text-orange-500 dark:text-orange-400" />
              <div>
                <p className="font-semibold text-left text-foreground group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">Pagar Servicios</p>
                <p className="font-normal text-sm text-muted-foreground text-left">Ver recibos y servicios pendientes.</p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/products" passHref>
            <Button variant="outline" size="lg" className="w-full h-24 text-lg justify-start p-6 border hover:bg-accent">
              <Package className="w-6 h-6 mr-4 text-muted-foreground" />
              <div>
                <p className="font-semibold text-left">Comprar Productos</p>
                <p className="font-normal text-sm text-gray-500 text-left">Explorar catálogo de productos.</p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/history" passHref>
            <Button variant="outline" size="lg" className="w-full h-24 text-lg justify-start p-6 border hover:bg-accent">
              <History className="w-6 h-6 mr-4 text-muted-foreground" />
              <div>
                <p className="font-semibold text-left text-foreground">Ver Historial</p>
                <p className="font-normal text-sm text-muted-foreground text-left">Revisar pagos y compras pasadas.</p>
              </div>
            </Button>
          </Link>

        </CardContent>
      </Card>
    </div>
  );
}
export default Dashboard;