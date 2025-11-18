'use client'
import { getServicios } from "@/api/services/CatalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Servicio } from "@/interfaces/services/Service";
import {
  AlertCircle, Loader2, CreditCard, Package, Zap,
  Film, Ticket, Star, CalendarDays,
  Search,
} from 'lucide-react';
import { InputHTMLAttributes, useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";

const serviceTypeInfo = {
  'UTILIDAD': {
    label: 'Servicio Básico',
    icon: Zap,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  'SUSCRIPCION': {
    label: 'Suscripción',
    icon: Star,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
  'CINE': {
    label: 'Cine',
    icon: Film,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
  },
  'EVENTO': {
    label: 'Evento',
    icon: Ticket,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
  'OTRO': {
    label: 'Otro Servicio',
    icon: Package,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  }
};

const Services = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
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
  }, [cliente, authLoading]);
  const serviciosFiltrados = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="ml-3 text-lg text-muted-foreground">Cargando servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-destructive/10 border border-destructive/30 rounded-lg p-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-700">¡Error!</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Pagar Servicios
      </h1>
      <div className="relative w-full md:w-72 mb-5">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          name="search"
          type="text"
          placeholder="Buscar servicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>

      {serviciosFiltrados.length === 0 && !isLoading ? (
        <p className="text-muted-foreground text-center py-4">
          No hay servicios disponibles para pagar en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviciosFiltrados.map((servicio) => {

            const typeInfo = serviceTypeInfo[servicio.tipo_servicio] || serviceTypeInfo['OTRO'];
            const Icon = typeInfo.icon;

            return (
              <Card key={servicio.idServicio} className="bg-card border border-border flex flex-col justify-between hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
                <Link href={`/dashboard/services/${servicio.idServicio}`} passHref>
                  <CardHeader className="p-0">
                    <div className="w-full h-48 rounded-t-lg bg-secondary flex items-center justify-center relative">
                      {servicio.imagenURL ? (
                        <Image
                          src={servicio.imagenURL}
                          alt={servicio.nombre}
                          layout="fill"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-16 h-16 text-muted-foreground/50" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color} mb-2 self-start`}>
                      <Icon className="w-3 h-3 mr-1.5" />
                      {typeInfo.label}
                    </div>
                    <CardTitle className="text-xl mb-2">{servicio.nombre}</CardTitle>

                    <p className="text-sm text-muted-foreground mb-4 flex-grow min-h-[60px]">
                      {servicio.sinopsis || servicio.descripcion || 'Servicio sin descripción.'}
                    </p>
                    {servicio.fecha_evento && (
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        {new Date(servicio.fecha_evento).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    )}
                    {servicio.rating && (
                      <div className="flex items-center text-sm text-yellow-500 mb-3">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <span className="font-bold">{servicio.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground/70 ml-1">/ 5.0</span>
                      </div>
                    )}

                    <div className="text-right mt-auto">
                      <p className="text-xs text-muted-foreground">
                        {servicio.tipo_servicio === 'SUSCRIPCION' ? 'Monto Mensual' : 'Monto a Pagar'}
                      </p>
                      <p className="text-2xl font-bold text-foreground mb-4">
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