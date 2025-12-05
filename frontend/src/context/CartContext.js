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

  // 상품 추가
 // 상품 추가
const addToCart = (item) => {

  // 상품 고유 ID를 정확히 찾기
  const realId = 
    item.id || 
    item.productId || 
    item.pno || 
    item.pid || 
    item.name;


  const uniqueId = `${realId}_${item.option}`;
  item.uniqueId = uniqueId;

  const existing = cartItems.find((i) => i.uniqueId === uniqueId);

  if (existing) {
    setCartItems((prev) =>
      prev.map((i) =>
        i.uniqueId === uniqueId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
    );
  } else {
    setCartItems((prev) => [
      ...prev,
      {
        ...item,
        uniqueId,
        allOptions: item.allOptions || item.options || ["기본옵션"],
      },
    ]);
  }
};


  // 수량 변경
  const updateQuantity = (uniqueId, newQty) => {
    if (newQty < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // 옵션 변경
  // ⭐ 옵션 변경
const updateOption = (uniqueId, id, newOption) => {
  const oldItem = cartItems.find((i) => i.uniqueId === uniqueId);
  if (!oldItem) return;

  const newUniqueId = `${id}_${newOption}`;

  const exists = cartItems.find((i) => i.uniqueId === newUniqueId);

  // 새 옵션 상품이 이미 장바구니에 존재한다면 → 합치기
  if (exists) {
    setCartItems((prev) =>
      prev
        .map((item) => {
          // 기존 같은 옵션의 상품 → 수량 합쳐짐
          if (item.uniqueId === newUniqueId) {
            return { ...item, quantity: item.quantity + oldItem.quantity };
          }
          return item;
        })
        // 변경했던 옛 상품 제거
        .filter((item) => item.uniqueId !== uniqueId)
    );
  } 
  // 새 옵션 상품이 없다면 → 그냥 uniqueId 변경
  else {
    setCartItems((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId
          ? { ...item, option: newOption, uniqueId: newUniqueId }
          : item
      )
    );
  }
};


  // 삭제
  const removeFromCart = (uniqueId) => {
    setCartItems((prev) => prev.filter((i) => i.uniqueId !== uniqueId));
  };

  // 총 금액
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
