export interface Servicio {
  idServicio: string;
  nombre: string;
  descripcion: string | null;
  recibo: number;
  imagen_url?: string;
}