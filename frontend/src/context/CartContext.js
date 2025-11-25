import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const exist = prev.find(
        (p) => p.id === item.id && p.option === item.option
      );

      if (exist) {
        return prev.map((p) =>
          p.id === item.id && p.option === item.option
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }

      return [...prev, item];
    });
  };

  const updateQuantity = (id, option, quantity) => {
    if (quantity < 1) return;

    setCartItems((prev) =>
      prev.map((p) =>
        p.id === id && p.option === option ? { ...p, quantity } : p
      )
    );
  };

  const updateOption = (id, oldOption, newOption) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p.id === id && p.option === oldOption
          ? { ...p, option: newOption }
          : p
      )
    );
  };

  const removeFromCart = (id, option) => {
    setCartItems((prev) =>
      prev.filter((p) => !(p.id === id && p.option === option))
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        updateOption,
        removeFromCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
