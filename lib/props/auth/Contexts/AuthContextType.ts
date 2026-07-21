import { Cliente } from "@/interfaces/Cliente";
import { User } from "@/interfaces/User";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cliente: Cliente | null;
  setCliente: (cliente: Cliente | null) => void;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (nombre: string, email: string, pass: string, telefono: string, dni: string) => Promise<void>;
  logout: () => void;
  showWelcomeModal: boolean;
  closeWelcomeModal: () => void;
  updatePassword:(password:string, newPassword:string) =>Promise<void>;
  syncUser: (userId: string) => void;
  loginWithBcp: (dni: string, pass: string) => Promise<void>;
}