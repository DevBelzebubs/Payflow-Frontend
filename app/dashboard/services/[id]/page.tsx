'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getServicioById } from '@/api/services/CatalogService';
import { Servicio } from '@/interfaces/services/Service';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2, AlertCircle, CreditCard, Package, ArrowLeft,
  CalendarDays, Film, Zap, Ticket, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StarRating } from '../../products/[id]/StarRating';

const serviceTypeInfo = {
  'UTILIDAD': { label: 'Servicio Básico', icon: Zap, color: 'text-blue-600' },
  'SUSCRIPCION': { label: 'Suscripción', icon: Star, color: 'text-purple-600' },
  'CINE': { label: 'Cine', icon: Film, color: 'text-red-600' },
  'EVENTO': { label: 'Evento', icon: Ticket, color: 'text-green-600' },
  'OTRO': { label: 'Otro Servicio', icon: Package, color: 'text-gray-600' }
};

const getYouTubeVideoId = (url: string | null): string | null => {
  if (!url) return null;
  let videoId: string | null = null;

  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1].split('?')[0];
  }

  return videoId;
};

const formatServiceDate = (dateString: string | null): string | null => {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return null;
  }
};


const ServiceDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        try {
          setIsLoading(true); setError(null);
          const data = await getServicioById(id);
          setServicio(data);
        } catch (err) {
          setError('Servicio no encontrado o no disponible.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchService();
    }
  }, [id]);

  const handlePayment = () => {
    alert(`Iniciando pago por: ${servicio?.nombre} - $${servicio?.recibo.toFixed(2)}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="ml-4 text-lg text-gray-600">Cargando servicio...</p>
      </div>
    );
  }

  if (error || !servicio) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg p-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-xl font-semibold text-red-700">{error || 'Servicio no encontrado'}</p>
        <Button asChild variant="link" className="text-orange-600 mt-2">
          <Link href="/dashboard/services"><ArrowLeft className="w-4 h-4 mr-2" />Volver a Servicios</Link>
        </Button>
      </div>
    );
  }

  const typeInfo = serviceTypeInfo[servicio.tipo_servicio] || serviceTypeInfo['OTRO'];
  const Icon = typeInfo.icon;
  const youtubeVideoIdForBanner = (servicio.tipo_servicio === 'CINE' || servicio.tipo_servicio === 'EVENTO')
    ? getYouTubeVideoId(servicio.video_url)
    : null;

  const posterImageUrl = servicio.imagenURL;
  const formattedDate = formatServiceDate(servicio.fecha_evento);

  return (
    <div>

      {youtubeVideoIdForBanner && (
        <div className="w-full h-72 md:h-96 bg-background flex flex-col justify-end overflow-hidden relative mb-8 rounded-lg">
          <div
            className="video-banner-wrap"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -50%)',
              overflow: 'hidden',
              minWidth: '100vw',
              minHeight: '100vh',
            }}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeVideoIdForBanner}?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&loop=1&playlist=${youtubeVideoIdForBanner}`}
              title="Video de fondo"
              frameBorder="0"
              sandbox="allow-scripts allow-same-origin"
              allow="autoplay; encrypted-media"
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                border: 0,
                filter: 'brightness(0.7)'
              }}
              tabIndex={-1}
            ></iframe>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white shadow-lg">
              {servicio.nombre}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-gray-900 px-0">
            <Link href="/dashboard/services">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Servicios
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="w-full max-w-md mx-auto lg:max-w-none rounded-lg overflow-hidden border shadow-lg">
              {posterImageUrl ? (
                <img
                  src={posterImageUrl}
                  alt={`Póster de ${servicio.nombre}`}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                  <Icon className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <span className={cn(
              "text-sm font-medium flex items-center",
              typeInfo.color
            )}>
              <Icon className="w-4 h-4 mr-1.5" />
              {typeInfo.label}
            </span>

            {!youtubeVideoIdForBanner && (
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-1 mb-2">
                {servicio.nombre}
              </h2>
            )}

            {servicio.rating && (
              <StarRating rating={servicio.rating} totalReviews={0} showTotal={false} />
            )}

            <p className="text-4xl font-bold text-orange-600 mb-6 mt-4">
              ${servicio.recibo.toFixed(2)}
            </p>

            <p className="text-foreground text-base leading-relaxed mb-6">
              {servicio.sinopsis || servicio.descripcion || "Este servicio no tiene una descripción detallada."}
            </p>

            {formattedDate && (
              <div className="flex items-center text-foreground font-medium mb-6 p-3 bg-background rounded-md border">
                <CalendarDays className="w-5 h-5 mr-3 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500">Fecha del Evento</p>
                  <p>{formattedDate}</p>
                </div>
              </div>
            )}
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6">
              <Link href={`/dashboard/payment/selection/${servicio.idServicio}`}>
                <CreditCard className="w-5 h-5 mr-3" />
                Pagar Ahora
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Detalles Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              {servicio.proveedor && (
              <div className="flex justify-between items-center text-sm p-3 bg-background rounded-md mb-2">
                  <span className="font-medium text-foreground">Proveedor</span>
                  <span className="font-medium text-foreground text-right">{servicio.proveedor}</span>
                </div>
              )}

              {servicio.info_adicional_json && Object.keys(servicio.info_adicional_json).length > 0 ? (
                <div className="space-y-2 pt-4">
                  {Object.entries(servicio.info_adicional_json).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm p-3 bg-background rounded-md">
                      <span className="font-medium text-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium text-foreground text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                !servicio.proveedor && (
                  <p className="text-gray-500 text-sm">No hay detalles adicionales disponibles.</p>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;