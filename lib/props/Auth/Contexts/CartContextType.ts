import { Producto } from "@/interfaces/services/Products";

export type CartItem = (Producto) & {
  quantity: number;
};
export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Producto) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  itemCount: number;
}