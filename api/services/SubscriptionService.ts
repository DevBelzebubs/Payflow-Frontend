import { Suscription } from "@/interfaces/services/Suscription";
import { api } from "../axiosConfig";

export const getMisSuscripciones = async (clienteId:string):Promise<Suscription[]> =>{
    try {
        const response = await api.get<Suscription[]>(`/suscripciones/cliente/${clienteId}`);
        return response.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.error || "No se pudieron cargar las suscripciones.");
    }
}
export const cancelarSuscripcion = async (suscripcionId:string) => {
    const response = await api.patch(`/suscripciones/${suscripcionId}/cancelar`);
    return response.data;
}