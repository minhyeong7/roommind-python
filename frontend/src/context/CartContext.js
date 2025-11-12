// src/context/CartContext.js
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ 장바구니 추가
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.option === product.option
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.option === product.option
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ✅ 수량 조절
  const updateQuantity = (id, option, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.option === option
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  // ✅ 옵션 변경
  const updateOption = (id, oldOption, newOption) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.option === oldOption
          ? { ...item, option: newOption }
          : item
      )
    );
  };

  // ✅ 삭제
  const removeFromCart = (id, option) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.option === option)
      )
    );
  };

  // ✅ 총합계
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // ✅ 로컬스토리지 유지
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateOption,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
