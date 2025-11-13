'use client'
import { getServicioById } from '@/api/services/CatalogService';
import { getMisCuentas } from '@/api/services/PaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BankAccount } from '@/interfaces/BankAccounts/BankAccount';
import { Servicio } from '@/interfaces/services/Service';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Loader2, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const PaymentSelectionPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [cuentas, setCuentas] = useState<BankAccount[]>([]);
  const [selectedCuentaId, setSelectedCuentaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [srv, accs] = await Promise.all([getServicioById(id), getMisCuentas()]);
        setServicio(srv);
        setCuentas(accs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [id]);
  const handleContinue = () => {
    if (selectedCuentaId && servicio) {
      router.push(`/dashboard/payment/checkout?serviceId=${servicio.idServicio}&accountId=${selectedCuentaId}`);
    }
  };
  if (isLoading) return <div className="flex justify-center h-96 items-center"><Loader2 className="animate-spin text-orange-500" /></div>;
  if (!servicio) return <div className="flex justify-center h-96 items-center"><p className="text-gray-500">Servicio no encontrado</p></div>;
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button asChild variant="link" className="text-orange-600 mt-2">
          <Link onClick={() => router.back()} href={''}><ArrowLeft className="w-4 h-4 mr-2" />Volver a {servicio.nombre}</Link>
        </Button>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Seleccionar Método de Pago</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-fit border-l-4 border-l-orange-500 shadow-md">
          <CardHeader className="bg-gray-50 pb-4">
            <CardTitle className="text-lg text-gray-700">Detalles del Servicio</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Servicio</p>
              <p className="text-xl font-semibold text-gray-900">{servicio?.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Proveedor</p>
              <p className="font-medium">{servicio?.proveedor || 'PayFlow'}</p>
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total a Pagar</span>
              <span className="text-3xl font-bold text-orange-600">${servicio?.recibo.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center text-gray-800">
            <Wallet className="w-5 h-5 mr-2 text-gray-500" /> Mis Cuentas Disponibles
          </h2>
          {cuentas.length === 0 && !isLoading ? (
            <p className="text-gray-500 text-center py-4">
              No hay cuentas asociadas en este usuario.
            </p>
          ) : (
            <div className="space-y-3">
              {cuentas.map((cuenta) => (
                <div
                  key={cuenta.id}
                  onClick={() => setSelectedCuentaId(cuenta.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between hover:shadow-md",
                    selectedCuentaId === cuenta.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-orange-200"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", selectedCuentaId === cuenta.id ? "bg-orange-200 text-orange-700" : "bg-gray-100 text-gray-500")}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{cuenta.banco}</p>
                      <p className="text-sm text-gray-500">{cuenta.tipoCuenta} •••• {cuenta.numeroCuenta.slice(-4)}</p>
                    </div>
                  </div>
                  {selectedCuentaId === cuenta.id && <CheckCircle2 className="w-6 h-6 text-orange-600" />}
                </div>
              ))}
            </div>
          )}
          <Button
            className="w-full py-6 text-lg bg-gray-900 hover:bg-black"
            disabled={!selectedCuentaId}
            onClick={handleContinue}
          >
            Continuar al Checkout <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
export default PaymentSelectionPage