'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/useAuth';

import { LayoutGrid, Package,History } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const Dashboard = () => {
 const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        ¡Bienvenido, {user?.nombre}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Gestiona tus pagos y productos desde un solo lugar.
      </p>

      <Card className="bg-card border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Selecciona qué te gustaría hacer a continuación.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <Link href="/dashboard/services" passHref>
            <Button variant="outline" size="lg" className="w-full h-24 text-lg justify-start p-6 border-orange-200 hover:bg-orange-50 hover:text-orange-700">
              <LayoutGrid className="w-6 h-6 mr-4 text-orange-500" />
              <div>
                <p className="font-semibold text-left">Pagar Servicios</p>
                <p className="font-normal text-sm text-gray-500 text-left">Ver recibos y servicios pendientes.</p>
              </div>
            </Button>
          </Link>
          
          <Link href="/dashboard/products" passHref>
              <Button variant="outline" size="lg" className="w-full h-24 text-lg justify-start p-6 border-gray-200 hover:bg-gray-50">
              <Package className="w-6 h-6 mr-4 text-gray-600" />
              <div>
                <p className="font-semibold text-left">Comprar Productos</p>
                <p className="font-normal text-sm text-gray-500 text-left">Explorar catálogo de productos.</p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/history" passHref>
              <Button variant="outline" size="lg" className="w-full h-24 text-lg justify-start p-6 border-gray-200 hover:bg-gray-50">
              <History className="w-6 h-6 mr-4 text-gray-600" />
              <div>
                <p className="font-semibold text-left">Ver Historial</p>
                <p className="font-normal text-sm text-gray-500 text-left">Revisar pagos y compras pasadas.</p>
              </div>
            </Button>
          </Link>

        </CardContent>
      </Card>
    </div>
  );
}
export default Dashboard;