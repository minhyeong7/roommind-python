// src/api/cartApi.js
import api from "./header";


/* =============================
   🔥 JWT 자동 헤더 추가
============================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 로그인 시 저장한 토큰
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =============================
   장바구니 API 모음
============================= */

// 1) 장바구니 담기
export const addToCart = async (item) => {
  return api.post("/cart", item);
};

// 2) 장바구니 조회
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

// 3) 수량 변경
export const updateCartCount = async (cartId, productCount) => {
  return api.patch(`/cart/${cartId}`, { productCount });
};

// 4) 개별 삭제
export const deleteCartItem = async (cartId) => {
  return api.delete(`/cart/${cartId}`);
};

// 5) 전체 삭제
export const clearCart = async () => {
  return api.delete("/cart/clear");
};

export default {
  addToCart,
  getCart,
  updateCartCount,
  deleteCartItem,
  clearCart,
};
