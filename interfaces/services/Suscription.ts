export interface Suscription {
  id: string;
  servicio_id: string;
  nombre_servicio: string;
  imagen_url?: string;
  fecha_inicio: string;
  fecha_ultimo_pago: string;
  fecha_proximo_pago: string;
  precio_acordado: number;
  estado: "ACTIVA" | "CANCELADA" | "MOROSA";
}
