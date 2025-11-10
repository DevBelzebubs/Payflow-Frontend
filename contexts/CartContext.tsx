'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Producto } from '@/interfaces/services/Products';
import { CartContextType, CartItem } from '@/lib/props/auth/Contexts/CartContextType';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([])
    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('payflow_cart')
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Error al cargar el carrito de localStorage", error)
        }
    }, [])
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('payflow_cart', JSON.stringify(cart));
        } else {
            localStorage.removeItem('payflow_cart')
        }
    }, [cart])
    const addToCart = (item: Producto) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((ci) => ci.id === item.id);

            if (existingItem) {
                return prevCart.map((ci) =>
                    ci.id === item.id
                        ? { ...ci, quantity: ci.quantity + 1 }
                        : ci
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };
    const removeFromCart = (itemId: string) => {
        setCart((prevCart) => prevCart.filter((ci) => ci.id !== itemId));
    };
    const clearCart = () => {
        setCart([]);
    };
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                itemCount
            }}>
            {children}
        </CartContext.Provider>
    );
}
