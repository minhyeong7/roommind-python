// src/context/CartContext.js
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ⭐ 상품 추가
  const addToCart = (item) => {
    // 🔥 이름까지 포함해서 uniqueId 생성
    const uniqueId = `${item.id}_${item.name}_${item.option}`;

    const existing = cartItems.find(
      (cartItem) => cartItem.uniqueId === uniqueId
    );

    if (existing) {
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.uniqueId === uniqueId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...item, uniqueId }]);
    }
  };

  // ⭐ 수량 변경
  const updateQuantity = (uniqueId, newQty) => {
    if (newQty < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // ⭐ 옵션 변경
  const updateOption = (uniqueId, id, name, newOption) => {
    const item = cartItems.find((i) => i.uniqueId === uniqueId);
    if (!item) return;

    // 🔥 옵션 변경 후 새로운 uniqueId 생성
    const newUniqueId = `${id}_${name}_${newOption}`;

    const exists = cartItems.find((i) => i.uniqueId === newUniqueId);

    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.uniqueId !== uniqueId) return i;

          if (exists) {
            // 이미 같은 상품+옵션이 존재 → 수량 합치기
            return { ...exists, quantity: exists.quantity + i.quantity };
          }

          return { ...i, option: newOption, uniqueId: newUniqueId };
        })
        .filter(Boolean)
    );
  };

  // ⭐ 삭제
  const removeFromCart = (uniqueId) => {
    setCartItems((prev) => prev.filter((item) => item.uniqueId !== uniqueId));
  };

  // ⭐ 총 금액
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
}
