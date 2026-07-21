import { api } from '@/lib/api/axiosConfig';

export interface CreateResenaData {
  calificacion: number;
  titulo: string;
  comentario: string;
}

export const createResena = async (productoId: string, data: CreateResenaData) => {
  try {
    const response = await api.post(`/productos/${productoId}/resenas`, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear reseña:', error);
    throw new Error('No se pudo crear la reseña.');
  }
};

export const updateResena = async (resenaId: string, data: CreateResenaData) => {
  try {
    const response = await api.put(`/resenas/${resenaId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    throw new Error('No se pudo actualizar la reseña.');
  }
};

export const deleteResena = async (resenaId: string) => {
  try {
    const response = await api.delete(`/resenas/${resenaId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    throw new Error('No se pudo eliminar la reseña.');
  }
};
