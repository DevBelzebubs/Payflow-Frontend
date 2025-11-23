import { api } from "@/api/axiosConfig";
import { BankAccount } from "@/interfaces/BankAccounts/BankAccount";
import { Orders } from "@/interfaces/services/Orders";
import { Producto } from "@/interfaces/services/Products";
import { Servicio } from "@/interfaces/services/Service";

export interface PagosPendientes {
  servicios: Servicio[];
  productos: Producto[];
}
export interface OrdenRequest {
  clienteId: string;
  items: {
    servicioId?: string;
    productoId?: string;
    cantidad: number;
    seats?: { row: string; col: number }[];
  }[];
  notas?: string;
  datosPago: {
    origen: "PAYFLOW" | "BCP";
    cuentaId: string;
    monto?: number;
  };
}
export const getPagosPendientes = async (): Promise<PagosPendientes> => {
  try {
    const response = await api.get<PagosPendientes>("/pagos/pendientes");
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo cargar la información de pagos.");
  }
};
export const getMisCuentas = async (): Promise<BankAccount[]> => {
  try {
    const response = await api.get<BankAccount[]>(
      "/cuentas-bancarias/mis-cuentas"
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener cuentas:", error);
    throw new Error("No se pudieron cargar las cuentas bancarias.");
  }
};
export const getCuentaById = async (cuentaId: string): Promise<BankAccount> => {
  try {
    const response = await api.get<BankAccount>(
      `/cuentas-bancarias/${cuentaId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener la cuenta:", error);
    throw new Error("No se pudo cargar la información de la cuenta.");
  }
};

export const procesarPagoOrden = async (orden: OrdenRequest) => {
  try {
    const response = await api.post("/ordenes", orden);
    return response.data;
  } catch (error: any) {
    console.error("Error al procesar el pago:", error);
    throw new Error(
      error.response?.data?.error || "Error al procesar el pago."
    );
  }
};
export const cancelarOrden = async (ordenId: string) => {
  try {
    const response = await api.post(`/ordenes/${ordenId}/cancelar`);
    return response.data;
  } catch (error: any) {
    console.error("Error al cancelar la orden:", error);
    throw new Error(
      error.response?.data?.error || "Error al cancelar la orden."
    );
  }
};
export const getMisOrdenes = async (clienteId: string): Promise<Orders[]> => {
  try {
    const response = await api.get<Orders[]>(`/ordenes/cliente/${clienteId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener las órdenes:', error);
    throw new Error(error.response?.data?.error || 'No se pudo cargar el historial.');
  }
};