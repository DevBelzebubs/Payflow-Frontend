'use client'
import { getServicios } from "@/api/services/CatalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Servicio } from "@/interfaces/services/Service";
import { AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { useEffect, useState } from "react";

const Services = () =>{
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(()=>{
        const cargarServicios = async () =>{
            try{
                setIsLoading(true);
                const data = await getServicios();
                setServicios(data);
                setError(null);
            }catch(error){
                setError(error instanceof Error ? error.message : 'Error inesperado');
            }finally{
                setIsLoading(false);
            }
        };
    cargarServicios();
    },[]);
    if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="ml-3 text-lg text-gray-600">Cargando servicios...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-700">¡Error!</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Pagar Servicios
      </h1>
      {servicios.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No hay servicios disponibles para pagar en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <Card key={servicio.idServicio} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{servicio.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 h-20 overflow-y-auto">
                  {servicio.descripcion || 'Servicio sin descripción.'}
                </p>
                <div className="text-right mt-auto">
                  <p className="text-xs text-gray-500">Monto a Pagar</p>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    ${servicio.recibo.toFixed(2)}
                  </p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Pagar Ahora
                    <CreditCard className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default Services;