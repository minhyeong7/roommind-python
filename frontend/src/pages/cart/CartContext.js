// src/pages/cart/CartContext.js
import { createContext, useState, useEffect } from "react";
import {
  addToCart as apiAddToCart,
  getCart as apiGetCart,
  updateCartCount as apiUpdateCartCount,
  deleteCartItem as apiDeleteCartItem,
} from "../../api/cartApi";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  /* ============================
     🟡 서버에서 장바구니 불러오기
  ============================ */
  const loadCartFromServer = async () => {
    try {
      const data = await apiGetCart();

      const mapped = data.map((dto) => {
        const option = dto.selectedOption || "기본옵션";
        return {
          cartId: dto.cartId,
          uniqueId: String(dto.cartId),
          productId: dto.productId,
          name: dto.productName ?? "이름없는 상품",
          price: dto.price ?? 0,
          image: dto.imageUrl ?? "/images/no-image.png",
          option,
          options: [option],
          quantity: dto.productCount ?? 1,
        };
      });

      setCartItems(mapped); // ⭐ 상태 업데이트 → UI 자동 리렌더
    } catch (e) {
      console.error("장바구니 불러오기 실패:", e);
    }
  };

  useEffect(() => {
    loadCartFromServer();
  }, []);

  /* ============================
     🛒 상품 추가
  ============================ */
  const addToCart = async (item) => {
    const productId = Number(item.productId ?? item.id);
    if (!productId) return alert("상품 ID가 없습니다.");

    const option = item.option || "기본옵션";
    const quantity = item.quantity > 0 ? item.quantity : 1;

    try {
      await apiAddToCart({
        productId,
        productCount: quantity,
        selectedOption: option,
      });

      await loadCartFromServer();
    } catch (e) {
      console.error("장바구니 추가 실패:", e);
    }
  };

  /* ============================
     수량 변경
  ============================ */
  const updateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;

    try {
      await apiUpdateCartCount(cartId, newQty);
      await loadCartFromServer();
    } catch (e) {
      console.error("수량 변경 실패:", e);
    }
  };

  /* ============================
     옵션 변경 (재생성 방식)
  ============================ */
  const updateOption = async (cartId, productId, newOption) => {
    const target = cartItems.find((item) => item.cartId === cartId);
    if (!target) return;

    try {
      await apiDeleteCartItem(cartId);

      await apiAddToCart({
        productId,
        productCount: target.quantity,
        selectedOption: newOption,
      });

      await loadCartFromServer();
    } catch (e) {
      console.error("옵션 변경 실패:", e);
    }
  };

  /* ============================
     삭제
  ============================ */
  const removeFromCart = async (cartId) => {
    try {
      await apiDeleteCartItem(cartId);
      await loadCartFromServer();
    } catch (e) {
      console.error("장바구니 삭제 실패:", e);
    }
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
