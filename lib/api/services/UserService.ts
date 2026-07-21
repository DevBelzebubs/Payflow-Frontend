import React from 'react'
import { api } from '../axiosConfig';
import { User } from '@/interfaces/User';
import { UpdateProfileDTO } from '@/interfaces/client/UpdateProfile';
export const updateUserProfile = async (data: UpdateProfileDTO): Promise<User> => {
  try {
    const response = await api.put('/users/profile', data);
    return response.data;
  } catch (error: any) {
    console.error("Error actualizando perfil:", error);
    throw new Error(error.response?.data?.error || 'Error al actualizar el perfil.');
  }
};
