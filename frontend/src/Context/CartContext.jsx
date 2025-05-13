import { createContext, useState, useEffect, use } from "react";
export const CartContext = createContext();
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
    });
    useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    }
    , [cartItems]);
    const addToCart = (product) => {
    setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
        return prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        } else {
        return [...prevItems, { ...product, quantity: 1 }];
        }
    });
    }
    const updateQuantity = (productId, amount) => {
        setCartItems((prevItems) =>
          prevItems
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                : item
            )
        );
      };
    
      const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      };
      const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart"); // Optionally remove from localStorage
      };
      
    return(
        <CartContext.Provider value={{ cartItems, addToCart,updateQuantity,removeFromCart,clearCart }}>
            {children}
        </CartContext.Provider>
    )
};
