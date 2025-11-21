'use client'
import { useAuth } from '@/hooks/auth/useAuth'
import React, { useEffect, useState } from 'react'

const ResetPasswordModal = () => {
    const {updatePassword, loading : authLoading} = useAuth();
    const [currentPassword,serCurrentPassword] = useState();
    const [newPassword, newSetPassword] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  return (
    <div></div>
  )
}
export default ResetPasswordModal();