"use client";
import { getCuentaById } from "@/api/services/PaymentService";
import TopUpModal from "@/app/dashboard/components/layout/TopUpModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BankAccount } from "@/interfaces/BankAccounts/BankAccount";
import { cn } from "@/lib/utils";
import { 
  AlertCircle, 
  ArrowLeft, 
  ArrowRightLeft, 
  Building2, 
  CreditCard, 
  DollarSign, 
  Loader2, 
  Zap,
  Trash2,
  Copy
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const AccountDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();   
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError("ID de cuenta no proporcionado.");
      return;
    }
    const fetchAccount = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getCuentaById(id);
          setAccount(data);
        } catch (error) {
          setError("Cuenta no encontrada o no disponible.");
        } finally {
          setIsLoading(false);
        }
    };
    fetchAccount();
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Número de cuenta copiado");
  };

  const SourceIcon = account?.origen === "BCP" ? CreditCard : Zap;
  const isWallet = account?.banco.toLowerCase().includes("monedero payflow");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
            <Loader2 className="relative w-12 h-12 text-orange-500 animate-spin" />
        </div>
        <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">Obteniendo detalles...</p>
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
            onClick={() => router.back()}
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver atrás
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8 pb-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <Button variant="ghost" onClick={() => router.back()} className="pl-0 mb-2 text-muted-foreground hover:text-foreground hover:bg-transparent p-0 h-auto">
                <ArrowLeft className="w-4 h-4 mr-2" /> Volver a Mis Cuentas
            </Button>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">Detalles de la Cuenta</h1>
                <div className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    account?.origen === "BCP" 
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800" 
                    : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
                )}>
                    <SourceIcon className="w-3 h-3 mr-1.5" />
                    {account?.origen}
                </div>
            </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-3 bg-gradient-to-br from-card to-muted/50 border-2 border-border shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardDescription className="text-base font-medium">Saldo Disponible</CardDescription>
                        <CardTitle className="text-5xl font-extrabold text-foreground mt-2 tracking-tight">
                            <span className="text-muted-foreground text-3xl mr-1">S/</span>
                            {account?.saldo.toFixed(2)}
                        </CardTitle>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <DollarSign className="w-8 h-8 text-primary" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                    <span className="flex w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Cuenta activa y operativa
                </div>
            </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    Información Bancaria
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Banco</p>
                        <p className="text-base font-medium text-foreground">{account?.banco}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tipo de Cuenta</p>
                        <p className="text-base font-medium text-foreground">{account?.tipoCuenta}</p>
                    </div>
                </div>
                
                <div className="pt-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Número de Cuenta</p>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50 group">
                        <code className="text-lg font-mono text-foreground flex-1">{account?.numeroCuenta}</code>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(account?.numeroCuenta || "")}
                            title="Copiar número"
                        >
                            <Copy className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>

                <div className="pt-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Titular</p>
                    <p className="text-base text-foreground mt-1">{account?.titular}</p>
                </div>
            </CardContent>
        </Card>
        
        <Card className="shadow-sm h-fit">
            <CardHeader>
                <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-sm h-auto py-4 flex-col gap-1 items-center justify-center group"
                    onClick={() => setIsTopUpOpen(true)}
                    disabled={isWallet}
                >
                    <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="font-semibold text-base">Transferir Saldo</span>
                    </div>
                    <span className="text-xs font-normal opacity-90">
                        {isWallet ? "Esta cuenta es tu Monedero" : "Hacia tu Monedero Payflow"}
                    </span>
                </Button>

                <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Cuenta
                </Button>
            </CardContent>
        </Card>
      </div>

      <TopUpModal 
        isOpen={isTopUpOpen} 
        onClose={() => setIsTopUpOpen(false)} 
        account={account!} 
      />
    </motion.div>
  );
};

export default AccountDetail;