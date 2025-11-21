"use client";
import { getCuentaById } from "@/api/services/PaymentService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankAccount } from "@/interfaces/BankAccounts/BankAccount";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowLeft, Building2, CreditCard, DollarSign, Loader2, Zap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AccountDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();   
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError("ID de cuenta no proporcionado.");
      return;
    }
    if (id) {
      const fetchAccount = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getCuentaById(id);
          setAccount(data);
        } catch (error) {
          setError("Producto no encontrado o no disponible.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAccount();
    }
  }, [id]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="ml-3 text-lg text-muted-foreground">Cargando cuenta...</p>
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
    const SourceIcon = account?.origen === "BCP" ? CreditCard : Zap;
  return (
  <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="pl-0 text-muted-foreground hover:text-foreground hover:bg-accent">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a Mis Cuentas
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Building2 className="w-8 h-8 mr-3 text-orange-500" />
          Detalles de la Cuenta
        </h1>
        <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
            account?.origen === "BCP" 
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
        )}>
          <SourceIcon className="w-4 h-4 mr-2" />
          {account?.origen}
        </div>
      </div>
      
      <Card className="shadow-lg border-2 border-border">
        <CardHeader className="bg-orange-50 dark:bg-card/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Saldo Disponible</p>
              <CardTitle className="text-4xl font-extrabold text-orange-600">
                S/ {account?.saldo.toFixed(2)}
              </CardTitle>
            </div>
            <DollarSign className="w-10 h-10 text-orange-500/70" />
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center text-lg p-3 bg-muted rounded-md border border-border">
              <span className="font-medium text-muted-foreground">Número de Cuenta</span>
              <span className="font-semibold text-foreground">{account?.numeroCuenta}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 p-3 bg-muted/50 rounded-md border border-border">
                <p className="text-sm font-medium text-muted-foreground">Banco</p>
                <p className="text-foreground">{account?.banco}</p>
              </div>
              <div className="space-y-2 p-3 bg-muted/50 rounded-md border border-border">
                <p className="text-sm font-medium text-muted-foreground">Tipo de Cuenta</p>
                <p className="text-foreground">{account?.tipoCuenta}</p>
              </div>
            </div>
            <div className="space-y-2 p-3 bg-muted/50 rounded-md border border-border">
                <p className="text-sm font-medium text-muted-foreground">Titular</p>
                <p className="text-foreground">{account?.titular}</p>
            </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-xl">Acciones de Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md py-6 text-lg">
            Transferir Saldo (En la cuenta {account?.banco})
          </Button>
          <Button variant="outline" className="w-full justify-center border-border hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700">
            Eliminar Cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
    );
};
export default AccountDetail;
