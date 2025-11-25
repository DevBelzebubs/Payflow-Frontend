'use client'
import { useAuth } from '@/hooks/auth/useAuth'
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ResetPasswordModal = ({ isOpen, onClose }: ResetPasswordModalProps) => {
  const { updatePassword, loading } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(()=>{
        setSuccess(false);
        onClose();
      },2000);
    } catch (error:any) {
      setError(error.message || "Error al cambiar la contraseña");
    }
  }
  return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cambiar Contraseña</DialogTitle>
                    <DialogDescription>
                        Ingresa tu contraseña actual y la nueva para actualizar tu cuenta.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-6 text-center text-green-600">
                        <p className="font-bold">¡Contraseña actualizada exitosamente!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="current">Contraseña Actual</Label>
                            <Input 
                                id="current" 
                                type="password" 
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="new">Nueva Contraseña</Label>
                            <Input 
                                id="new" 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
                            <Input 
                                id="confirm" 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Actualizar Contraseña
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
export default ResetPasswordModal;