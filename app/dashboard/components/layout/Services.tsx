'use client'
import { getServicios } from "@/api/services/CatalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Servicio } from "@/interfaces/services/Service";
import {
  AlertCircle, Loader2, CreditCard, Package, Zap,
  Film, Ticket, Star, CalendarDays,
  Search, FilterX, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const serviceTypeInfo: Record<string, { label: string; icon: any; className: string }> = {
  'UTILIDAD': {
    label: 'Servicio Básico',
    icon: Zap,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  'SUSCRIPCION': {
    label: 'Suscripción',
    icon: Star,
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  },
  'CINE': {
    label: 'Cine',
    icon: Film,
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  'EVENTO': {
    label: 'Evento',
    icon: Ticket,
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  },
  'OTRO': {
    label: 'Otro Servicio',
    icon: Package,
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
  }
};

const ITEMS_PER_PAGE = 8;

const Services = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { cliente, loading: authLoading } = useAuth();

  useEffect(() => {
    const cargarServicios = async () => {
      if (authLoading) return;
      
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const serviciosFiltrados = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(serviciosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentServicios = serviciosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
          <Loader2 className="relative w-12 h-12 text-orange-500 animate-spin" />
        </div>
        <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">Cargando servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="bg-destructive/10 p-6 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Hubo un problema</h3>
        <p className="text-muted-foreground mt-2 text-center max-w-md">{error}</p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Pagar Servicios
          </h1>
          <p className="text-muted-foreground mt-1">Gestiona tus pagos de servicios, suscripciones y eventos</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            name="search"
            type="text"
            placeholder="Buscar servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {serviciosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
            <FilterX className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No se encontraron servicios</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">
            Intenta con otro término de búsqueda.
          </p>
          {search && (
            <Button 
              variant="link" 
              className="text-orange-600 mt-2"
              onClick={() => setSearch("")}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      ) : (
        <>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {currentServicios.map((servicio, index) => {
                const typeInfo = serviceTypeInfo[servicio.tipo_servicio] || serviceTypeInfo['OTRO'];
                const TypeIcon = typeInfo.icon;

                return (
                  <motion.div
                    key={servicio.idServicio}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link href={`/dashboard/services/${servicio.idServicio}`} className="block h-full group">
                      <Card className="h-full flex flex-col overflow-hidden border-border/60 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 bg-card">
                        
                        <CardHeader className="p-0 relative aspect-video overflow-hidden bg-secondary/30">
                          <div className="absolute top-3 left-3 z-10">
                            <Badge variant="outline" className={`backdrop-blur-md bg-white/90 dark:bg-black/60 border-0 shadow-sm flex items-center gap-1.5 px-2.5 py-1 ${typeInfo.className}`}>
                              <TypeIcon className="w-3.5 h-3.5" />
                              {typeInfo.label}
                            </Badge>
                          </div>

                          {servicio.imagenURL ? (
                            <Image
                              src={servicio.imagenURL}
                              alt={servicio.nombre}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 group-hover:text-orange-500/20 transition-colors">
                              <TypeIcon className="w-20 h-20" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        </CardHeader>

                        <CardContent className="flex-grow p-5">
                          <CardTitle className="text-lg font-bold leading-tight line-clamp-1 mb-2 group-hover:text-orange-600 transition-colors">
                            {servicio.nombre}
                          </CardTitle>

                          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] mb-4">
                            {servicio.sinopsis || servicio.descripcion || 'Sin descripción disponible.'}
                          </p>

                          <div className="flex flex-wrap gap-y-2 items-center text-xs text-muted-foreground">
                            {servicio.fecha_evento && (
                              <div className="flex items-center mr-4 bg-muted/50 px-2 py-1 rounded-md">
                                <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                                {new Date(servicio.fecha_evento).toLocaleDateString('es-ES', { 
                                  month: 'short', day: 'numeric' 
                                })}
                              </div>
                            )}
                            {servicio.rating && (
                              <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded-md text-yellow-700 dark:text-yellow-500">
                                <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                                <span className="font-bold">{servicio.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>

                        <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-border/50 bg-muted/20">
                          <div className="flex flex-col py-3">
                            <span className="text-xs text-muted-foreground font-medium">
                              {servicio.tipo_servicio === 'SUSCRIPCION' ? 'Mensual' : 'Total'}
                            </span>
                            <span className="text-xl font-bold text-foreground">
                              S/ {servicio.recibo.toFixed(2)}
                            </span>
                          </div>
                          
                          <Button 
                            className="bg-orange-500 hover:bg-orange-600 text-white shadow-md group-hover:shadow-lg transition-all"
                          >
                            Pagar
                            <CreditCard className="w-4 h-4 ml-2" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Anterior</span>
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`h-9 w-9 p-0 ${currentPage === page 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'text-muted-foreground'}`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Siguiente</span>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default Services;