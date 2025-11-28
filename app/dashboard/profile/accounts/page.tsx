"use client";
import { getMisCuentas } from "@/api/services/PaymentService";
import { BankAccount } from "@/interfaces/BankAccounts/BankAccount";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ChevronRight,
  CreditCard,
  Loader2,
  Wallet,
  Zap,
  Plus
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ListAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    const cargarCuentas = async () => {
      try {
        setIsLoading(true);
        const data = await getMisCuentas();
        setAccounts(data);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error inesperado");
      } finally {
        setIsLoading(false);
      }
    };
    cargarCuentas();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
            <Loader2 className="relative w-12 h-12 text-orange-500 animate-spin" />
        </div>
        <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">Cargando tus cuentas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="bg-destructive/10 p-6 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Hubo un problema</h3>
        <p className="text-muted-foreground mt-2 text-center max-w-md">{error}</p>
        <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => window.location.reload()}
        >
            Intentar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
            <h3 className="text-3xl font-bold flex items-center text-foreground gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Wallet className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                Mis Cuentas
            </h3>
            <p className="text-muted-foreground mt-2 ml-1">Gestiona tus tarjetas y cuentas vinculadas.</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" /> Vincular Cuenta
        </Button>
      </div>

      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                <CreditCard className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No tienes cuentas vinculadas</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                Vincula tu primera cuenta bancaria o tarjeta para comenzar a operar en PayFlow.
            </p>
        </div>
      ) : (
        <motion.div 
            layout 
            className="grid gap-4"
        >
            <AnimatePresence mode="popLayout">
                {accounts.map((cuenta, index) => (
                    <motion.div
                        key={cuenta.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Link href={`accounts/${cuenta.id}`} passHref>
                            <Card className="group relative overflow-hidden border-border/60 hover:border-orange-500/50 hover:shadow-md transition-all duration-300 cursor-pointer bg-card">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="p-5 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300 border border-border/50",
                                            cuenta.origen === "BCP" 
                                                ? "bg-[#0033A0]/10 text-[#0033A0] dark:bg-blue-900/30 dark:text-blue-400" 
                                                : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                        )}>
                                            {cuenta.origen === "BCP" ? (
                                                <CreditCard className="w-6 h-6" />
                                            ) : (
                                                <Zap className="w-6 h-6" />
                                            )}
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground group-hover:text-orange-600 transition-colors">
                                                {cuenta.banco}
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                                <span className="font-medium text-foreground/80">{cuenta.tipoCuenta}</span>
                                                <span className="text-xs opacity-40">•</span>
                                                <span className="font-mono tracking-wide">•••• {cuenta.numeroCuenta.slice(-4)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:gap-8">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Saldo Disponible</p>
                                            <p className="font-bold text-xl text-foreground tabular-nums">
                                                S/ {cuenta.saldo.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 flex items-center justify-center transition-colors">
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
export default ListAccounts;