export interface BankAccount {
  id: string;
  banco: string;
  numeroCuenta: string;
  tipoCuenta: string;
  titular: string;
  saldo: number;
  activo: boolean;
  origen: "PAYFLOW" | "BCP";
}
