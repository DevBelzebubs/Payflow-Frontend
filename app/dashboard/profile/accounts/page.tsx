"use client";
import { getMisCuentas } from "@/api/services/PaymentService";
import { BankAccount } from "@/interfaces/BankAccounts/BankAccount";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Building2,
  ChevronRight,
  CreditCard,
  Loader2,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="ml-3 text-lg text-muted-foreground">
          Cargando cuentas...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-destructive/10 border border-destructive/30 rounded-lg p-6">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold text-destructive">¡Error!</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center text-foreground">
        <Wallet className="w-6 h-6 mr-3 text-orange-500" /> Mis Cuentas
        Vinculadas
      </h3>
      {accounts.length === 0 ? (
        <div className="text-center text-muted-foreground py-6 border border-border rounded-lg bg-card">
          <p>No tienes cuentas bancarias vinculadas en PayFlow.</p>
          <p className="text-sm mt-1">
            Contacta a soporte para vincular tu primera cuenta.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
                 {" "}
          {accounts.map((cuenta) => (
            <Link
              key={cuenta.id}
              href={`accounts/${cuenta.id}`}
              passHref
            >
              <div
                className={cn(
                  "p-4 rounded-xl border-2 shadow-sm flex items-center justify-between transition-all cursor-pointer",
                  "border-border bg-card hover:border-orange-500 hover:shadow-lg"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    {cuenta.origen === "BCP" ? (
                      <CreditCard className="w-5 h-5" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{cuenta.banco}</p>
                    <p className="text-sm text-muted-foreground">
                      {cuenta.tipoCuenta} •••• {cuenta.numeroCuenta.slice(-4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Saldo</p>
                    <p className="font-bold text-lg text-foreground">
                      S/ {cuenta.saldo.toFixed(2)}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
               {" "}
        </div>
      )}
       {" "}
    </div>
  );
};
export default ListAccounts;
