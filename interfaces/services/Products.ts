import { ImagenProducto } from "../Review/ImagenProducto";
import { Reseña } from "../Review/Reseña";

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  categoria: string | null;
  activo: boolean;
  imagen_url?: string | null;
  
  marca?: string | null;
  especificaciones?: Record<string, string>;
  imagenes?: ImagenProducto[];
  reseñas?: Reseña[];
  rating_promedio?: number;
  total_reseñas?: number;
}