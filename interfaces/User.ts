export interface User {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  activo: boolean;
  dni:string;
  rol:string;
  banner_url?: string;
  avatar_url?: string;
}