import { AuthContext } from '@/contexts/AuthContext';
import React, { useContext } from 'react'
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};