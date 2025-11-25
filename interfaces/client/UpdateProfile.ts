import { User } from "@/interfaces/User";

export interface UpdateProfileDTO {
  nombre?: string;
  telefono?: string;
  email?: string;
  password?: string;
  newPassword?:string;
  avatar_url?: string;
  banner_url?: string;
}