import React, { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./auth";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [auth, , loading] = useAuth();
  const [cart, setCart] = useState([]);
  useEffect(() => {
    if (!loading) {
      const userId = auth?.user?._id;
      const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];

      if (userId) {
        const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        const mergedCart = [
          ...userCart,
          ...guestCart.filter((guestItem) => !userCart.find((u) => u._id === guestItem._id)),
        ];

        setCart(mergedCart);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(mergedCart));
        localStorage.removeItem("cart_guest"); 
      } else {
        setCart(guestCart);
      }
    }
  }, [auth, loading]);

  useEffect(() => {
    if (!loading) {
      const userId = auth?.user?._id;
      if (userId) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
      } else {
        localStorage.setItem("cart_guest", JSON.stringify(cart));
      }
    }
  }, [cart, auth, loading]);

  return <CartContext.Provider value={[cart, setCart]}>{children}</CartContext.Provider>;
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
