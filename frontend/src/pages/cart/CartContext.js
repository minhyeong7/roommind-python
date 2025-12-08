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

  /* ============================
     🛒 상품 추가
     item 안에 최소한 아래 값이 들어오도록 맞추면 됨:
     - productId (숫자)
     - name / productName
     - price / salePrice
     - image (선택)
     - option (선택)
  ============================ */
  const addToCart = (item) => {
    // 1) productId를 숫자로 강제
    const productId = Number(
      item.productId ??
        item.id // 혹시 옛 코드에서 id로 쓰고 있다면
    );

    if (!productId) {
      console.error("❌ productId가 없는 상품입니다. addToCart 실패:", item);
      alert("장바구니에 담을 수 없는 상품입니다.");
      return;
    }

    const option = item.option || "기본옵션";
    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;

    // 2) 같은 상품 + 같은 옵션이면 uniqueId 동일
    const uniqueId = `${productId}_${option}`;

    const existing = cartItems.find((i) => i.uniqueId === uniqueId);

    if (existing) {
      // 이미 있으면 수량만 증가
      setCartItems((prev) =>
        prev.map((i) =>
          i.uniqueId === uniqueId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      // 새로 추가
      setCartItems((prev) => [
        ...prev,
        {
          uniqueId,
          productId,
          name: item.name ?? item.productName ?? "이름없는 상품",
          price: item.price ?? item.salePrice ?? 0,
          image: item.image ?? item.images?.[0] ?? "/images/no-image.png",
          option,
          options: item.options || item.allOptions || ["기본옵션"],
          quantity,
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

  /* ============================
     옵션 변경
     - uniqueId: 기존 아이템 키 (ex: "61_기본옵션")
     - productId: 상품 PK (숫자)
     - newOption: 변경할 옵션 문자열
  ============================ */
  const updateOption = (uniqueId, productId, newOption) => {
    const oldItem = cartItems.find((i) => i.uniqueId === uniqueId);
    if (!oldItem) return;

    const newUniqueId = `${productId}_${newOption}`;
    const exists = cartItems.find((i) => i.uniqueId === newUniqueId);

    if (exists) {
      // 이미 같은 상품+옵션이 있으면 수량 합치고 옛 아이템 제거
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.uniqueId === newUniqueId
              ? { ...item, quantity: item.quantity + oldItem.quantity }
              : item
          )
          .filter((item) => item.uniqueId !== uniqueId)
      );
    } else {
      // 그냥 uniqueId와 option만 변경
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
