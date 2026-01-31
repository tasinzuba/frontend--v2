"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalPrice: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('medistore-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('medistore-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any, quantity: number = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: Math.min(item.stock, item.quantity + quantity) }
                        : item
                );
            }
            return [...prevCart, {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity: quantity
            }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalPrice,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
