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
      console.log("🔄 장바구니 데이터 불러오는 중...");
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

      setCartItems(mapped);
      console.log("✅ 장바구니 업데이트 완료:", mapped.length, "개 항목");
    } catch (e) {
      console.error("❌ 장바구니 불러오기 실패:", e);
    }
  };

  // 최초 마운트 시 한 번만 실행
  useEffect(() => {
    loadCartFromServer();
  }, []);

  /* ============================
     🛒 상품 추가
  ============================ */
  const addToCart = async (item) => {
    const productId = Number(item.productId ?? item.id);
    if (!productId) {
      alert("상품 ID가 없습니다.");
      return false;
    }

    const option = item.option || "기본옵션";
    const quantity = item.quantity > 0 ? item.quantity : 1;

    try {
      console.log("🛒 장바구니에 추가 중...", { productId, quantity, option });
      
      // 서버에 추가 요청
      await apiAddToCart({
        productId,
        productCount: quantity,
        selectedOption: option,
      });

      console.log("✅ 서버에 추가 완료");

      // ⭐ 장바구니 최신 데이터 다시 불러오기
      await loadCartFromServer();
      
      console.log("✅ 장바구니 UI 업데이트 완료");
      return true;
    } catch (e) {
      console.error("❌ 장바구니 추가 실패:", e);
      alert("장바구니 추가에 실패했습니다.");
      return false;
    }
  };

  /* ============================
     수량 변경
  ============================ */
  const updateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;

    try {
      console.log("🔄 수량 변경 중...", { cartId, newQty });
      await apiUpdateCartCount(cartId, newQty);
      await loadCartFromServer();
      console.log("✅ 수량 변경 완료");
    } catch (e) {
      console.error("❌ 수량 변경 실패:", e);
      alert("수량 변경에 실패했습니다.");
    }
  };

  /* ============================
     옵션 변경 (재생성 방식)
  ============================ */
  const updateOption = async (cartId, productId, newOption) => {
    const target = cartItems.find((item) => item.cartId === cartId);
    if (!target) return;

    try {
      console.log("🔄 옵션 변경 중...", { cartId, newOption });
      
      // 기존 항목 삭제
      await apiDeleteCartItem(cartId);

      // 새 옵션으로 다시 추가
      await apiAddToCart({
        productId,
        productCount: target.quantity,
        selectedOption: newOption,
      });

      await loadCartFromServer();
      console.log("✅ 옵션 변경 완료");
    } catch (e) {
      console.error("❌ 옵션 변경 실패:", e);
      alert("옵션 변경에 실패했습니다.");
    }
  };

  /* ============================
     삭제
  ============================ */
  const removeFromCart = async (cartId) => {
    try {
      console.log("🗑️ 삭제 중...", { cartId });
      await apiDeleteCartItem(cartId);
      await loadCartFromServer();
      console.log("✅ 삭제 완료");
    } catch (e) {
      console.error("❌ 장바구니 삭제 실패:", e);
      alert("삭제에 실패했습니다.");
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