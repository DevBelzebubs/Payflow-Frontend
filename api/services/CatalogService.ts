import { Servicio } from "@/interfaces/services/Service";
import { api } from '@/api/axiosConfig';
import { Producto } from "@/interfaces/services/Products";
export const getServicios = async ():Promise<Servicio[]> =>{
    try {
    const response = await api.get<Servicio[]>('/api/servicios');
    return response.data;
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw new Error('No se pudo cargar el catálogo de servicios.');
  }
}
export const getProductos = async ():Promise<Producto[]> =>{
    try {
    const response = await api.get<Producto[]>('/api/productos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('No se pudo cargar el catálogo de productos.');
  }
}