export interface Servicio {
  idServicio: string;
  nombre: string;
  descripcion: string | null;
  recibo: number;
  imagenURL?: string;
  tipo_servicio: 'UTILIDAD' | 'SUSCRIPCION' | 'CINE' | 'EVENTO' | 'OTRO';
  sinopsis: string | null;
  
  fecha_evento: string | null;
  video_url: string | null;
  proveedor: string | null;
  rating: number | null;
  info_adicional_json: Record<string, any> | null;
  activo:boolean;
}