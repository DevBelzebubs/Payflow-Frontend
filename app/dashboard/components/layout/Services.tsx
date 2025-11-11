'use client'
import { getServicios } from "@/api/services/CatalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Servicio } from "@/interfaces/services/Service";
import {
  AlertCircle, Loader2, CreditCard, Package, Zap,
  Film, Ticket, Star, CalendarDays,
} from 'lucide-react';
import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";

const serviceTypeInfo = {
  'UTILIDAD': {
    label: 'Servicio Básico',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  'SUSCRIPCION': {
    label: 'Suscripción',
    icon: Star,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  'CINE': {
    label: 'Cine',
    icon: Film,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  'EVENTO': {
    label: 'Evento',
    icon: Ticket,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  'OTRO': {
    label: 'Otro Servicio',
    icon: Package,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  }
};

const Services = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cliente, loading: authLoading } = useAuth();

  useEffect(() => {
    const cargarServicios = async () => {
      if (authLoading) {
        return;
      }
      if (!cliente?.id) {
        setIsLoading(false);
        setError("No se pudo identificar al cliente. Por favor, inicie sesión de nuevo.");
        return;
      }
      try {
        setIsLoading(true);
        const data = await getServicios(cliente.id);

        setServicios(data.filter(s => s.activo === true));
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error inesperado');
      } finally {
        setIsLoading(false);
      }
    };
    cargarServicios();
  }, [cliente,authLoading]);

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
      {servicios.length === 0 && !isLoading ? (
        <p className="text-gray-500 text-center py-4">
          No hay servicios disponibles para pagar en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {servicios.map((servicio) => {

            const typeInfo = serviceTypeInfo[servicio.tipo_servicio] || serviceTypeInfo['OTRO'];
            const Icon = typeInfo.icon;

            return (
              <Card key={servicio.idServicio} className="flex flex-col justify-between hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
                <Link href={`/dashboard/services/${servicio.idServicio}`} passHref>
                  <CardHeader className="p-0">
                    <div className="w-full h-48 rounded-t-lg bg-gray-100 flex items-center justify-center relative">
                      {servicio.imagenURL ? (
                        <Image
                          src={servicio.imagenURL}
                          alt={servicio.nombre}
                          layout="fill"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-16 h-16 text-gray-300" />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 flex flex-col flex-grow">

                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color} mb-2 self-start`}>
                      <Icon className="w-3 h-3 mr-1.5" />
                      {typeInfo.label}
                    </div>

                    <CardTitle className="text-xl mb-2">{servicio.nombre}</CardTitle>

                    <p className="text-sm text-gray-600 mb-4 flex-grow min-h-[60px]">
                      {servicio.sinopsis || servicio.descripcion || 'Servicio sin descripción.'}
                    </p>

                    {servicio.fecha_evento && (
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        {new Date(servicio.fecha_evento).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    )}
                    {servicio.rating && (
                      <div className="flex items-center text-sm text-yellow-500 mb-3">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <span className="font-bold">{servicio.rating.toFixed(1)}</span>
                        <span className="text-gray-400 ml-1">/ 5.0</span>
                      </div>
                    )}

                    <div className="text-right mt-auto">
                      <p className="text-xs text-gray-500">
                        {servicio.tipo_servicio === 'SUSCRIPCION' ? 'Monto Mensual' : 'Monto a Pagar'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-4">
                        ${servicio.recibo.toFixed(2)}
                      </p>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        Pagar Ahora
                        <CreditCard className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
export default Services;