import { Servicio } from "@/interfaces/services/Service";
import { api } from '@/api/axiosConfig';
import { Producto } from "@/interfaces/services/Products";

export const getServicios = async (clienteId:string):Promise<Servicio[]> =>{
    try {
    const response = await api.get<Servicio[]>('/servicios',{
      params:{ clienteId }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw new Error('No se pudo cargar el catálogo de servicios.');
  }
}
export const getServicioById = async (id: string): Promise<Servicio> => {
  try {
    const response = await api.get<Servicio>(`/servicios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el servicio ${id}:`, error);
    throw new Error('No se pudo cargar el servicio.');
  }
};
export const getProductos = async ():Promise<Producto[]> =>{
    try {
    const response = await api.get<Producto[]>('/productos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('No se pudo cargar el catálogo de productos.');
  }
}
export const getProductoById = async (id: string): Promise<Producto> => {
  try {
    const response = await api.get<Producto>(`/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto ${id}:`, error);
    throw new Error('No se pudo cargar el producto.');
  }
};