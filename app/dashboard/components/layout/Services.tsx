'use client'
import { getServicios } from "@/api/services/CatalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Servicio } from "@/interfaces/services/Service";
import {
  AlertCircle, Loader2, CreditCard, Package, Zap,
  Film, Ticket, Star, CalendarDays,
  Search, FilterX, ChevronLeft, ChevronRight,
  LayoutGrid,
  Layers
} from 'lucide-react';
import { useEffect, useMemo, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { list } from "postcss";

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
  const [isGrouped, setIsGrouped] = useState<Boolean>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('service_config') : null;
      return raw ? JSON.parse(raw) as boolean : false;
    } catch {
      return false;
    }
  });

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
  }, [search, isGrouped]);
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('service_config', JSON.stringify(isGrouped));
    } catch (err) {
      console.warn('Failed to persist service_config', err);
    }
  }, [isGrouped])
  const serviciosFiltrados = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(serviciosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentServicios = serviciosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const serviciosPorCategoria = useMemo(() => {
    const grupos: Record<string, Servicio[]> = {};
    Object.keys(serviceTypeInfo).forEach(key => grupos[key] = []);
    serviciosFiltrados.forEach(servicio => {
      const tipo = serviceTypeInfo[servicio.tipo_servicio] ? servicio.tipo_servicio : 'OTRO';
      grupos[tipo].push(servicio);
    });
    return Object.entries(grupos).filter(([_, list]) => list.length > 0);
  }, [serviciosFiltrados]);

  const renderServiceCard = (servicio: Servicio, index: number) => {
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
                <Image src={servicio.imagenURL} alt={servicio.nombre} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
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
                    {new Date(servicio.fecha_evento).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
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
                <span className="text-xl font-bold text-foreground">S/ {servicio.recibo.toFixed(2)}</span>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-md group-hover:shadow-lg transition-all">
                Pagar <CreditCard className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </motion.div>
    );
  };
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Pagar Servicios</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus pagos de servicios, suscripciones y eventos</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex bg-muted p-1 rounded-lg border border-border">
            <Button
              variant={!isGrouped ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setIsGrouped(false)}
              className={!isGrouped ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> Todos
            </Button>
            <Button
              variant={isGrouped ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setIsGrouped(true)}
              className={isGrouped ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}>
              <Layers className="w-4 h-4 mr-2" /> Categorías
            </Button>
          </div>

          <div className="relative flex-1 md:w-64 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
              name="search"
              type="text"
              placeholder="Buscar servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {serviciosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <FilterX className="w-10 h-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No se encontraron servicios</h3>
          {search && <Button variant="link" className="text-orange-600 mt-2" onClick={() => setSearch("")}>Limpiar búsqueda</Button>}
        </div>
      ) : (
        <>
          {isGrouped ? (
            <div className="space-y-12">
              {serviciosPorCategoria.map(([tipo, items]) => {
                const info = serviceTypeInfo[tipo] || serviceTypeInfo['OTRO'];
                const Icon = info.icon;
                return (
                  <div key={tipo} className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-border pb-2">
                      <div className={`p-2 rounded-lg ${info.className}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{info.label}</h2>
                      <Badge variant="secondary" className="ml-auto">{items.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {items.map((servicio, index) => renderServiceCard(servicio, index))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {currentServicios.map((servicio, index) => renderServiceCard(servicio, index))}
                </AnimatePresence>
              </motion.div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-border/50">
                  <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium px-4">Página {currentPage} de {totalPages}</span>
                  <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
export default Services;