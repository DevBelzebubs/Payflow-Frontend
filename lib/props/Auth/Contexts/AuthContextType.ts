import { User } from "@/interfaces/User";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (nombre: string, email: string, pass: string, telefono: string, dni: string) => Promise<void>;
  logout: () => void;
}