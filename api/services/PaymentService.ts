import { api } from '@/api/axiosConfig';
import { Producto } from '@/interfaces/services/Products';
import { Servicio } from '@/interfaces/services/Service';

export interface PagosPendientes {
  servicios: Servicio[];
  productos: Producto[];
}
export const getPagosPendientes = async ():Promise<PagosPendientes> =>{
    try{
        const response = await api.get<PagosPendientes>('/pagos/pendientes');
        return response.data;
    }catch(error){
        console.error(error);
        throw new Error('No se pudo cargar la información de pagos.');
    }
}