'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, Wallet } from 'lucide-react';
import { recargarMonedero } from '@/api/services/PaymentService';
import { BankAccount } from '@/interfaces/BankAccounts/BankAccount';
import { useRouter } from 'next/navigation';

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    account: BankAccount;
}

const TopUpModal = ({ isOpen, onClose, account }: TopUpModalProps) => {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const value = parseFloat(amount);
        if (isNaN(value) || value <= 0) {
            setError('Ingresa un monto válido.');
            return;
        }
        if (account.saldo < value) {
            setError('Saldo insuficiente en la cuenta de origen.');
            return;
        }
        try {
            setIsLoading(true);
            await recargarMonedero(account.id, value);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setAmount('');
                onClose();
                window.location.reload();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Error al realizar la recarga');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-orange-500" />
                        Recargar Monedero Payflow
                    </DialogTitle>
                    <DialogDescription>
                        Transfiere fondos desde tu cuenta <b>{account.banco}</b> (****{account.numeroCuenta.slice(-4)}) a tu monedero.
                    </DialogDescription>
                </DialogHeader>
                {success ? (
                    <div className="py-6 text-center text-green-600 animate-in zoom-in">
                        <p className="text-4xl mb-2">🎉</p>
                        <p className="font-bold text-lg">¡Recarga Exitosa!</p>
                        <p className="text-sm text-muted-foreground">Tu saldo ha sido actualizado.</p>
                    </div>
                ) : (
                    <form onSubmit={handleTopUp} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Monto a recargar (S/)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">S/</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    placeholder="0.00"
                                    className="pl-9 text-lg"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-right">
                                Saldo disponible: S/ {account.saldo.toFixed(2)}
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirmar Transferencia
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TopUpModal;